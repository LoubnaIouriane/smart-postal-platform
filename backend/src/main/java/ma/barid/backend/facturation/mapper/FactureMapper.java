package ma.barid.backend.facturation.mapper;

import ma.barid.backend.facturation.dto.FactureDTO;
import ma.barid.backend.facturation.dto.LigneFactureDTO;
import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.entity.LigneFacture;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FactureMapper {

    public FactureDTO toDTO(Facture facture) {
        FactureDTO dto = new FactureDTO();
        dto.setIdFacture(facture.getIdFacture());
        dto.setNumeroFacture(facture.getNumeroFacture());
        dto.setClientId(facture.getClientId());
        dto.setClientRaisonSociale(facture.getClientRaisonSociale());
        dto.setDateEmission(facture.getDateEmission());
        dto.setDateEcheance(facture.getDateEcheance());
        dto.setMontantHT(facture.getMontantHT());
        dto.setTauxTVA(facture.getTauxTVA());
        dto.setMontantTVA(facture.getMontantTVA());
        dto.setMontantTTC(facture.getMontantTTC());
        dto.setTauxRemise(facture.getTauxRemise());
        dto.setMontantRemise(facture.getMontantRemise());
        dto.setDatePaiement(facture.getDatePaiement());
        dto.setStatutPaiement(facture.getStatutPaiement().name());
        dto.setLignes(facture.getLignes().stream().map(this::toLigneDTO).toList());
        return dto;
    }

    public List<FactureDTO> toDTOList(List<Facture> factures) {
        return factures.stream().map(this::toDTO).toList();
    }

    private LigneFactureDTO toLigneDTO(LigneFacture ligne) {
        LigneFactureDTO dto = new LigneFactureDTO();
        dto.setIdLigne(ligne.getIdLigne());
        dto.setDesignation(ligne.getDesignation());
        dto.setQuantite(ligne.getQuantite());
        dto.setPrixUnitaire(ligne.getPrixUnitaire());
        dto.setMontantLigne(ligne.getMontantLigne());
        dto.setExpeditionId(ligne.getExpeditionId());
        return dto;
    }
}
