package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
import ma.barid.backend.auth.repository.VilleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1) // s'exécute avant TranchePoidsSeeder, peu importe ici mais bonne pratique
public class VilleSeeder implements CommandLineRunner {

    private final VilleRepository repository;

    public VilleSeeder(VilleRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.save(new Ville(1L, "RABAT", "1"));
        repository.save(new Ville(2L, "CASABLANCA", "2"));
        repository.save(new Ville(3L, "TANGER", "3"));
        repository.save(new Ville(4L, "OUJDA", "4"));
        repository.save(new Ville(5L, "FES", "5"));
        repository.save(new Ville(6L, "AGADIR", "6"));
        repository.save(new Ville(7L, "MARRAKECH", "7"));
        repository.save(new Ville(8L, "LAAYOUNE", "8"));
    }
}