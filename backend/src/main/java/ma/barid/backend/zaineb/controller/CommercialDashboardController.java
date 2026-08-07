package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.CommercialDashboardDTO;
import ma.barid.backend.zaineb.service.CommercialDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commercial/dashboard")
@RequiredArgsConstructor
public class CommercialDashboardController {

    private final CommercialDashboardService service;

    @GetMapping("/statistiques")
    public CommercialDashboardDTO statistiques() {

        return service.getStatistiques();

    }

}

