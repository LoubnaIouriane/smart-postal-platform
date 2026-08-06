package ma.barid.backend.facturation;

import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.mapper.FactureMapper;
import ma.barid.backend.facturation.repository.ExpeditionFacturationRepository;
import ma.barid.backend.facturation.repository.FactureRepository;
import ma.barid.backend.facturation.serviceImpl.FactureServiceImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

class FactureServiceImplTest {

    @Test
    void createBloqueLaSaisieManuelleDesFactures() {
        FactureServiceImpl service = new FactureServiceImpl(
                mock(FactureRepository.class),
                mock(ClientRepository.class),
                mock(ExpeditionFacturationRepository.class),
                new FactureMapper()
        );

        assertThrows(IllegalStateException.class, () -> service.create(new FactureCreateRequest()));
    }
}
