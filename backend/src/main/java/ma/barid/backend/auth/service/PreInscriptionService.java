// auth/service/PreInscriptionService.java
package ma.barid.backend.auth.service;

import ma.barid.backend.auth.dto.PreInscriptionRequest;

public interface PreInscriptionService {
    void creerDemande(PreInscriptionRequest request);
}