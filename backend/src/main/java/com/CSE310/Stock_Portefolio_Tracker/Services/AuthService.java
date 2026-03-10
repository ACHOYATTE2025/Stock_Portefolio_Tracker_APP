package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.math.BigDecimal;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.SignupRequestDto;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Role;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Wallet;
import com.CSE310.Stock_Portefolio_Tracker.Enum.TypeRole;
import com.CSE310.Stock_Portefolio_Tracker.Repository.RoleRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.UserxRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.WalletRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements  UserDetailsService{

    private final UserxRepository userxRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final WalletRepository walletRepository;

    public void RegisterUserService(SignupRequestDto request) {
        

        validateEmail(request.getEmail());
        checkUserAlreadyExists(request.getEmail());

        Userx user = buildUser(request);
       
        this.userxRepository.save(user);
        Wallet wallet = new Wallet();
        wallet.setUserx(user);
        wallet.setAmount(BigDecimal.ZERO);
        walletRepository.save(wallet);

        log.info("User successfully created with email: {}", user.getEmail());

        
    }

    // ===================== PRIVATE METHODS =====================

    private void checkUserAlreadyExists(String email) {
        if (userxRepository.existsByEmail(email)) {
            throw new RuntimeException("User exist already");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.contains("@") || !email.contains(".")) {
            throw new IllegalArgumentException("EMAIL NOT VALID");
        }
    }

    

    
     

    private Userx buildUser(SignupRequestDto request) {
        

      // 🔥 Récupérer le rôle EXISTANT (ne jamais le créer ici)
        Role role = roleRepository.findByLibele(TypeRole.USER)
                .orElseThrow(() -> new RuntimeException("ROLE USER NOT FOUND"));

        return Userx.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();
    }


    
    @Override
    public UserDetails loadUserByUsername(String email) {
        return userxRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));
    }

}
