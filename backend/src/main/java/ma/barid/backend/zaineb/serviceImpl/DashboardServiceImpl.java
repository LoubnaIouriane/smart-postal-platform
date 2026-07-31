package ma.barid.backend.zaineb.serviceimpl;

import ma.barid.backend.zaineb.dto.DashboardDTO;
import ma.barid.backend.zaineb.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Override
    public DashboardDTO getDashboard() {

        return DashboardDTO.builder()
                .nbClients(0L)
                .nbContrats(0L)
                .nbDemandes(0L)
                .chiffreAffaire(0.0)
                .build();

    }

}