package ma.barid.backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hashBD = "$2a$10$jVZDW99WCxgGAoATz20ta.EpuFmDnNJm6Sk6BgJ7zW8irvDN7WqYi";

        System.out.println(
                "motdepasse123 : " +
                        encoder.matches("motdepasse123", hashBD)
        );

        System.out.println(
                "Passer123 : " +
                        encoder.matches("Passer123", hashBD)
        );
    }
}