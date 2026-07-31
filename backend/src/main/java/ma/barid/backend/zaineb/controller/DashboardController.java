package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.DashboardDTO;
import ma.barid.backend.zaineb.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commercial/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardDTO getDashboard(){

        return dashboardService.getDashboard();

    }

}