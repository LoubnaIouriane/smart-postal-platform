package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
import ma.barid.backend.auth.repository.VilleRepository;
import ma.barid.backend.facteur.FacteurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // annule automatiquement les changements après chaque test, base propre
class ExpeditionServiceTest {

    @Autowired
    private ExpeditionService expeditionService;

    @Autowired
    private VilleRepository villeRepository;

    private Long idVilleRabat;
    private Long idVilleCasa;

    @BeforeEach
    void setUp() {
        // On récupère 2 villes réelles déjà en base (Rabat=1, Casablanca=2)
        idVilleRabat = 1L;
        idVilleCasa = 2L;
    }

    @Test
    void creerExpedition_devraitGenererCodeTrackingEtStatutEnAttente() {
        ExpeditionRequest request = new ExpeditionRequest();
        request.setTypeEnvoi(TypeEnvoi.COLIS);
        request.setPoids(3.0);
        request.setIdVilleDepart(idVilleRabat);
        request.setIdVilleDestination(idVilleCasa);
        request.setNomDestinataire("Test Destinataire");
        request.setTelephoneDestinataire("0600000000");

        Expedition expedition = expeditionService.creerExpedition(request);

        assertNotNull(expedition.getIdExpedition());
        assertNotNull(expedition.getCodeTracking());
        assertTrue(expedition.getCodeTracking().startsWith("EXP"));
        assertEquals(StatutExpedition.EN_ATTENTE, expedition.getStatut());
        assertNotNull(expedition.getMontant());
        assertTrue(expedition.getMontant().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    void creerExpedition_devraitRefuserPoidsSuperieurA31() {
        ExpeditionRequest request = new ExpeditionRequest();
        request.setTypeEnvoi(TypeEnvoi.COLIS);
        request.setPoids(50.0); // au-dessus du max
        request.setIdVilleDepart(idVilleRabat);
        request.setIdVilleDestination(idVilleCasa);
        request.setNomDestinataire("Test");
        request.setTelephoneDestinataire("0600000000");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> expeditionService.creerExpedition(request)
        );
        assertTrue(exception.getMessage().contains("31"));
    }

    @Test
    void creerExpedition_devraitRefuserPoidsNul() {
        ExpeditionRequest request = new ExpeditionRequest();
        request.setTypeEnvoi(TypeEnvoi.COLIS);
        request.setPoids(null);
        request.setIdVilleDepart(idVilleRabat);
        request.setIdVilleDestination(idVilleCasa);

        assertThrows(IllegalArgumentException.class,
                () -> expeditionService.creerExpedition(request));
    }

    @Test
    void changerStatut_devraitPermettreEnAttenteVersValidee() {
        Expedition expedition = creerExpeditionTest();

        Expedition maj = expeditionService.changerStatut(
                expedition.getIdExpedition(), StatutExpedition.VALIDEE);

        assertEquals(StatutExpedition.VALIDEE, maj.getStatut());
    }

    @Test
    void changerStatut_devraitRefuserEnAttenteVersCollectee() {
        // Transition interdite : on ne peut pas sauter directement à COLLECTEE
        Expedition expedition = creerExpeditionTest();

        assertThrows(IllegalArgumentException.class,
                () -> expeditionService.changerStatut(
                        expedition.getIdExpedition(), StatutExpedition.COLLECTEE));
    }

    @Test
    void enregistrerPoidsReel_devraitRecalculerMontantSiEcart() {
        Expedition expedition = creerExpeditionTest(); // créée avec poids = 3.0
        expeditionService.changerStatut(expedition.getIdExpedition(), StatutExpedition.VALIDEE);

        BigDecimal montantAvant = expedition.getMontant();

        Expedition maj = expeditionService.enregistrerPoidsReel(
                expedition.getIdExpedition(), 10.0); // poids réel très différent

        assertEquals(10.0, maj.getPoids());
        assertEquals(StatutExpedition.COLLECTEE, maj.getStatut());
        assertNotEquals(montantAvant, maj.getMontant()); // le prix a bien changé
    }

    @Test
    void enregistrerPoidsReel_neDevraitPasChangerMontantSiPoidsIdentique() {
        Expedition expedition = creerExpeditionTest(); // poids = 3.0
        expeditionService.changerStatut(expedition.getIdExpedition(), StatutExpedition.VALIDEE);

        BigDecimal montantAvant = expedition.getMontant();

        Expedition maj = expeditionService.enregistrerPoidsReel(
                expedition.getIdExpedition(), 3.0); // même poids

        assertEquals(montantAvant, maj.getMontant());
        assertEquals(StatutExpedition.COLLECTEE, maj.getStatut());
    }

    // ===== méthode utilitaire pour les tests =====
    private Expedition creerExpeditionTest() {
        ExpeditionRequest request = new ExpeditionRequest();
        request.setTypeEnvoi(TypeEnvoi.COLIS);
        request.setPoids(3.0);
        request.setIdVilleDepart(idVilleRabat);
        request.setIdVilleDestination(idVilleCasa);
        request.setNomDestinataire("Test");
        request.setTelephoneDestinataire("0600000000");
        return expeditionService.creerExpedition(request);
    }
}