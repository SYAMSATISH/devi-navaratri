package devi.config;

import devi.entity.User;
import devi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@devi.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                User admin = new User();

                admin.setName("Devi Admin");
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println(
                        "===================================="
                );
                System.out.println(
                        "DEFAULT ADMIN CREATED"
                );
                System.out.println(
                        "Email: admin@devi.com"
                );
                System.out.println(
                        "Password: Admin@123"
                );
                System.out.println(
                        "===================================="
                );
            }
        };
    }
}
