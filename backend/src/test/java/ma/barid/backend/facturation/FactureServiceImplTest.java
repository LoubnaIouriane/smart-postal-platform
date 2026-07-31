package ma.barid.backend.facturation;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FactureServiceImplTest {

    @Test
    void createCalculeCorrectementHtRemiseTvaTtc() throws Exception {
        Class<?> repositoryType = Class.forName("ma.barid.backend.facturation.repository.FactureRepository");
        Class<?> mapperType = Class.forName("ma.barid.backend.facturation.mapper.FactureMapper");
        Class<?> serviceType = Class.forName("ma.barid.backend.facturation.serviceImpl.FactureServiceImpl");
        Class<?> factureType = Class.forName("ma.barid.backend.facturation.entity.Facture");
        Class<?> requestType = Class.forName("ma.barid.backend.facturation.dto.FactureCreateRequest");
        Class<?> ligneRequestType = Class.forName("ma.barid.backend.facturation.dto.FactureCreateRequest$LigneFactureRequest");

        Object repository = mock(repositoryType);
        Object mapper = mapperType.getConstructor().newInstance();
        Object service = serviceType.getConstructor(repositoryType, mapperType).newInstance(repository, mapper);

        when(repositoryType.getMethod("countByNumeroFactureStartingWith", String.class)
                .invoke(repository, (Object) any())).thenReturn(0L);
        when(repositoryType.getMethod("save", Object.class)
                .invoke(repository, (Object) any())).thenAnswer(invocation -> invocation.getArgument(0));

        Object request = requestType.getConstructor().newInstance();
        invoke(request, "setClientId", Long.class, 1L);
        invoke(request, "setClientRaisonSociale", String.class, "Atlas Logistics");
        invoke(request, "setClientIdentifiant", String.class, "client1");
        invoke(request, "setTauxTVA", Double.class, 20.0);
        invoke(request, "setTauxRemise", Double.class, 10.0);
        invoke(request, "setLignes", List.class, List.of(ligne(ligneRequestType, "Envoi colis", 2, 100.0)));

        Object result = serviceType.getMethod("create", requestType).invoke(service, request);

        assertEquals(200.0, (Double) result.getClass().getMethod("getMontantHT").invoke(result));
        assertEquals(20.0, (Double) result.getClass().getMethod("getMontantRemise").invoke(result));
        assertEquals(36.0, (Double) result.getClass().getMethod("getMontantTVA").invoke(result));
        assertEquals(216.0, (Double) result.getClass().getMethod("getMontantTTC").invoke(result));
    }

    private Object ligne(Class<?> ligneRequestType, String designation, int quantite, double prixUnitaire) throws Exception {
        Object ligne = ligneRequestType.getConstructor().newInstance();
        invoke(ligne, "setDesignation", String.class, designation);
        invoke(ligne, "setQuantite", Integer.class, quantite);
        invoke(ligne, "setPrixUnitaire", Double.class, prixUnitaire);
        return ligne;
    }

    private static void invoke(Object target, String methodName, Class<?> parameterType, Object value) throws Exception {
        Method method = target.getClass().getMethod(methodName, parameterType);
        method.invoke(target, value);
    }
}
