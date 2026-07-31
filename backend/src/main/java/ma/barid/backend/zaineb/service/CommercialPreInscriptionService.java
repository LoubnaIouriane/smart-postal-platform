package ma.barid.backend.zaineb.service;

import ma.barid.backend.auth.entity.Client;

import java.util.List;

public interface CommercialPreInscriptionService {


    List<Client> getDemandes();


    Client valider(Long id);


    Client refuser(Long id);

}