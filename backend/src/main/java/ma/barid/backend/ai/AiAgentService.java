package ma.barid.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.LocalDate;
import java.util.*;

/**
 * Orchestrateur de l'agent : c'est NOTRE code qui pilote la boucle
 * question -> choix d'outil par le modèle -> exécution sécurisée -> réponse.
 * Le modèle (Ollama, local) ne fait que choisir un outil et rédiger la réponse.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAgentService {
    private final AiTools tools;
    private final ObjectMapper om;
    private final RestClient rest = RestClient.builder().requestFactory(factory()).build();

    @Value("${ai.ollama.url:http://localhost:11434}") private String ollamaUrl;
    @Value("${ai.ollama.model:qwen2.5:7b}") private String model;

    private static SimpleClientHttpRequestFactory factory() {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(5_000);
        f.setReadTimeout(180_000); // un modèle local peut être lent (chargement en mémoire au 1er appel)
        return f;
    }

    private String systemFor(String role) {
        String base = "Tu es l'assistant IA de la plateforme Smart Postal de Barid Al-Maghrib. Date du jour : " + LocalDate.now() + ". "
                + "Réponds en français (vouvoiement), en texte brut sans markdown (pas de ** ni #), de façon courte et claire. "
                + "Pour toute question sur des données, appelle d'abord l'outil adapté ; n'invente jamais un statut, un montant, une date ou un délai. "
                + "Si un outil renvoie une erreur ou rien, dis-le simplement. Tu consultes seulement : tu ne crées, modifies ni n'annules rien. Montants en MAD. ";
        return base + switch (role) {
            case "ADMIN" -> "Tu assistes l'ADMINISTRATEUR : statistiques, tendances, anomalies, variations de facturation, rapports. "
                    + "Pour un rapport, structure : Résumé, Chiffres clés, Points d'attention, Recommandations. "
                    + "Pour une comparaison, donne les deux valeurs et la variation en %. Les mois sont au format YYYY-MM ; 'ce mois' = mois de la date du jour.";
            case "COMMERCIAL" -> "Tu assistes un COMMERCIAL : activité, expéditions et facturation des clients validés. Reste synthétique ; pour un client, cherche d'abord son idClient avec list_clients.";
            default -> "Tu assistes un CLIENT. Statuts : EN_ATTENTE = demande enregistrée, en attente de validation ; VALIDEE = validée, en attente de collecte par le facteur ; "
                    + "COLLECTEE = colis collecté par le facteur ; ANNULEE = annulée (annulation impossible après la collecte ou moins de 10 minutes avant l'heure de collecte). "
                    + "Le tarif dépend uniquement du poids (tranches de poids), pas de la distance. "
                    + "Pour CHAQUE question de prix, appelle estimate_price avec le poids demandé, même si tu as déjà donné un prix plus haut dans la conversation ; ne réutilise jamais un prix précédent pour un autre poids. "
                    + "La plateforme n'enregistre aucune date de livraison estimée : n'invente jamais de délai. En cas de retard ou de problème, "
                    + "rassure et oriente vers l'agence Barid Al-Maghrib la plus proche en lui donnant le code de suivi.";
        };
    }

    public String chat(AiController.ChatRequest r, Authentication auth) {
        String role = AiTools.roleOf(auth);
        if (tools.forRole(role).isEmpty()) return "L'assistant IA n'est pas disponible pour votre profil.";

        List<Map<String, Object>> msgs = new ArrayList<>();
        msgs.add(Map.of("role", "system", "content", systemFor(role)));
        if (r.history() != null) {
            var h = r.history();
            h.subList(Math.max(0, h.size() - 8), h.size()).stream()
                    .filter(t -> t != null && t.content() != null && ("user".equals(t.role()) || "assistant".equals(t.role()))) // jamais de rôle forgé (ni system, ni tool)
                    .forEach(t -> msgs.add(Map.of("role", t.role(), "content", t.content())));
        }
        msgs.add(Map.of("role", "user", "content", r.message()));

        // AiTools décrit les outils au format {name, description, input_schema} : on les convertit au format Ollama
        List<Map<String, Object>> toolDefs = tools.forRole(role).stream()
                .map(t -> Map.<String, Object>of("type", "function", "function",
                        Map.of("name", t.get("name"), "description", t.get("description"), "parameters", t.get("input_schema"))))
                .toList();

        try {
            for (int i = 0; i < 6; i++) {
                JsonNode res = rest.post().uri(ollamaUrl + "/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("model", model, "stream", false, "messages", msgs, "tools", toolDefs,
                                "keep_alive", "30m", "options", Map.of("temperature", 0)))
                        .retrieve().body(JsonNode.class);

                JsonNode m = res.path("message");
                JsonNode calls = m.path("tool_calls");
                if (!calls.isArray() || calls.isEmpty()) {
                    String txt = m.path("content").asText("").replaceAll("(?s)<think>.*?</think>", "").trim(); // certains modèles exposent leur raisonnement
                    return txt.isEmpty() ? "Je n'ai pas pu formuler de réponse. Reformulez votre question." : txt;
                }
                msgs.add(Map.of("role", "assistant", "content", m.path("content").asText(""), "tool_calls", calls));
                for (JsonNode c : calls) {
                    String name = c.path("function").path("name").asText();
                    JsonNode args = toObject(c.path("function").path("arguments"));
                    // exécution SÉCURISÉE : identité et rôle viennent du JWT, pas du modèle
                    msgs.add(Map.of("role", "tool", "tool_name", name, "content", tools.execute(name, args, auth)));
                }
            }
        } catch (ResourceAccessException e) {
            log.error("Ollama injoignable sur {}", ollamaUrl, e);
            return "Le modèle local ne répond pas. Vérifiez qu'Ollama est lancé sur ce poste.";
        } catch (RestClientResponseException e) {
            log.error("Erreur Ollama {} : {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Erreur du modèle local (" + e.getStatusCode().value() + "). Vérifiez que le modèle '" + model + "' est téléchargé (ollama pull).";
        }
        return "Désolé, je n'ai pas pu terminer l'analyse. Reformulez votre question.";
    }

    /** Les arguments arrivent normalement en objet JSON, mais certains modèles les envoient sous forme de texte. */
    private JsonNode toObject(JsonNode args) {
        try {
            if (args.isTextual()) args = om.readTree(args.asText());
        } catch (Exception ignored) { /* arguments illisibles → objet vide */ }
        return args != null && args.isObject() ? args : om.createObjectNode();
    }
}