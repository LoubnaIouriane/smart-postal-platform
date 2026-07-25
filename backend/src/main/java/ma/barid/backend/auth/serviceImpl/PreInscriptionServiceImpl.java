// auth/serviceImpl/PreInscriptionServiceImpl.java
package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.dto.PreInscriptionRequest;
import ma.barid.backend.auth.entity.*;
import ma.barid.backend.auth.enums.StatutClient;
import ma.barid.backend.auth.repository.*;
import ma.barid.backend.auth.service.PreInscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PreInscriptionServiceImpl implements PreInscriptionService {

    private final ClientRepository clientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final VilleRepository villeRepository;
    private final AgenceRepository agenceRepository;

    @Override
    public void creerDemande(PreInscriptionRequest request) {

        if (request.getIce() == null && request.getRc() == null && request.getPatente() == null) {
            throw new RuntimeException("Au moins un document d'identification (ICE, RC ou Patente) est requis");
        }
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est deja utilise");
        }

        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville invalide"));

        // Affectation automatique de l'agence selon la ville
        Agence agence = agenceRepository.findFirstByVille(ville)
                .orElseThrow(() -> new RuntimeException("Aucune agence trouvee pour cette ville"));

        Role roleClient = roleRepository.findByNomRole("CLIENT")
                .orElseThrow(() -> new RuntimeException("Role CLIENT introuvable, verifie le seed de la table role"));

        Client client = Client.builder()
                .email(request.getEmail())
                .actif(false)          // pas encore de compte actif
                .identifiant(null)     // genere seulement a la validation
                .motDePasse(null)
                .dateCreation(LocalDateTime.now())
                .role(roleClient)
                .ice(request.getIce())
                .rc(request.getRc())
                .patente(request.getPatente())
                .raisonSociale(request.getRaisonSociale())
                .activitePrincipale(request.getActivitePrincipale())
                .telephone(request.getTelephone())
                .adresse(request.getAdresse())
                .codePostal(request.getCodePostal())
                .dateInscription(LocalDate.now())
                .statut(StatutClient.PRE_INSCRIPTION)
                .ville(ville)
                .agence(agence)
                .build();

        clientRepository.save(client);
    }
}