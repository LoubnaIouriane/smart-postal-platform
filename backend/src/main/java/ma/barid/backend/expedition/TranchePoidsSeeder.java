package ma.barid.backend.expedition;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TranchePoidsSeeder implements CommandLineRunner {

    private final TranchePoidsRepository repository;

    public TranchePoidsSeeder(TranchePoidsRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        BigDecimal[][] tranches = {
                {new BigDecimal("0.001"), new BigDecimal("1"), new BigDecimal("13")},
                {new BigDecimal("1.001"), new BigDecimal("2"), new BigDecimal("14.35")},
                {new BigDecimal("2.001"), new BigDecimal("3"), new BigDecimal("15")},
                {new BigDecimal("3.001"), new BigDecimal("4"), new BigDecimal("17.95")},
                {new BigDecimal("4.001"), new BigDecimal("5"), new BigDecimal("19")},
                {new BigDecimal("5.001"), new BigDecimal("6"), new BigDecimal("23")},
                {new BigDecimal("6.001"), new BigDecimal("7"), new BigDecimal("24")},
                {new BigDecimal("7.001"), new BigDecimal("8"), new BigDecimal("26.75")},
                {new BigDecimal("8.001"), new BigDecimal("9"), new BigDecimal("28")},
                {new BigDecimal("9.001"), new BigDecimal("10"), new BigDecimal("29.55")},
                {new BigDecimal("10.001"), new BigDecimal("11"), new BigDecimal("32")},
                {new BigDecimal("11.001"), new BigDecimal("12"), new BigDecimal("33")},
                {new BigDecimal("12.001"), new BigDecimal("13"), new BigDecimal("34")},
                {new BigDecimal("13.001"), new BigDecimal("14"), new BigDecimal("36")},
                {new BigDecimal("14.001"), new BigDecimal("15"), new BigDecimal("38")},
                {new BigDecimal("15.001"), new BigDecimal("16"), new BigDecimal("42")},
                {new BigDecimal("16.001"), new BigDecimal("17"), new BigDecimal("43")},
                {new BigDecimal("17.001"), new BigDecimal("18"), new BigDecimal("45")},
                {new BigDecimal("18.001"), new BigDecimal("19"), new BigDecimal("46")},
                {new BigDecimal("19.001"), new BigDecimal("20"), new BigDecimal("49")},
                {new BigDecimal("20.001"), new BigDecimal("21"), new BigDecimal("53")},
                {new BigDecimal("21.001"), new BigDecimal("22"), new BigDecimal("55")},
                {new BigDecimal("22.001"), new BigDecimal("23"), new BigDecimal("58")},
                {new BigDecimal("23.001"), new BigDecimal("24"), new BigDecimal("59.55")},
                {new BigDecimal("24.001"), new BigDecimal("25"), new BigDecimal("64")},
                {new BigDecimal("25.001"), new BigDecimal("26"), new BigDecimal("66")},
                {new BigDecimal("26.001"), new BigDecimal("27"), new BigDecimal("69")},
                {new BigDecimal("27.001"), new BigDecimal("28"), new BigDecimal("73")},
                {new BigDecimal("28.001"), new BigDecimal("29"), new BigDecimal("75")},
                {new BigDecimal("29.001"), new BigDecimal("30"), new BigDecimal("76")},
                {new BigDecimal("30.001"), new BigDecimal("31"), new BigDecimal("80")},
        };

        for (BigDecimal[] t : tranches) {
            repository.save(new TranchePoids(null, t[0], t[1], t[2]));
        }
    }
}