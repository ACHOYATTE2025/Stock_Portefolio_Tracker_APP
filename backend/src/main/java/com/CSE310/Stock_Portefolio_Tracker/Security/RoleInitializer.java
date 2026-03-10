package com.CSE310.Stock_Portefolio_Tracker.Security;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Role;
import com.CSE310.Stock_Portefolio_Tracker.Enum.TypeRole;
import com.CSE310.Stock_Portefolio_Tracker.Repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class RoleInitializer {
    private final RoleRepository roleRepository;

    @Bean
    CommandLineRunner initRoles() {
        return args -> {
            if (roleRepository.findByLibele(TypeRole.USER).isEmpty()) {
                roleRepository.save(new Role( TypeRole.USER));
            }
            if (roleRepository.findByLibele(TypeRole.ADMIN).isEmpty()) {
                roleRepository.save(new Role( TypeRole.ADMIN));
            }
        };
    }

}
