package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.RefreshTokenDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.ResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.SignupResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Jwt;
import com.CSE310.Stock_Portefolio_Tracker.Entities.RefreshToken;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Repository.JwtRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.RefreshTokenRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.UserxRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final UserxRepository userxRepository;
    private final JwtRepository jwtRepository;
    private final RefreshTokenRepository refreshTokenRepository;
   



    public SignupResponseDto generateAndSaveToken(Userx userx) {
           log.info("Generating new JWT and RefreshToken for user: {}", userx.getEmail());
        // désactiver anciens tokens
        disableToken(userx);

        // générer nouveau JWT
        String jwtBearer = this.generateToken(userx);
        
          // Create refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .valeur(UUID.randomUUID().toString())
                .expire(false)
                .creation(Instant.now())
                .expiration(Instant.now().plusMillis(36000000))
                .build();
            refreshTokenRepository.save(refreshToken);

        // save en DB
        Jwt jwtbuild = Jwt.builder()
                .valeur(jwtBearer)
                .desactive(false)
                .expiration(false)
                .refreshToken(refreshToken)
                .userx(userx)
                .build();

        jwtRepository.save(jwtbuild);
        log.info("JWT and RefreshToken saved for user {}", userx.getEmail());

        return new SignupResponseDto(jwtBearer, refreshToken.getValeur());
    }


   
    public void disableToken(Userx userx) {
        List<Jwt> jwtList = jwtRepository.findByUserx(userx.getEmail())
                .peek(jwt -> {
                    jwt.setDesactive(true);
                    jwt.setExpiration(true);   
                }).toList();
        jwtRepository.saveAll(jwtList);
    }


    
    @Scheduled(cron = "@daily")
    public void removeUselessToken() {
        log.info("Suppression tokens invalid {}", Instant.now());
        jwtRepository.deleteByExpirationAndDesactive(true, true);
    }



    

    //production de refresh Token
     public SignupResponseDto refreshtoken(RefreshTokenDto refreshTokenDto) {
        final Jwt jwt= this.jwtRepository.findByRefreshToken(refreshTokenDto.getCode())
        .orElseThrow(()-> new RuntimeException("REFRESH-TOKEN Invalid"));

        if(jwt.getRefreshToken().isExpire() || jwt.getRefreshToken().getExpiration().isBefore(Instant.now()))
        { throw new RuntimeException("REFRESH-TOKEN EXPIRED "); };

        RefreshToken refresh= this.refreshTokenRepository.findByValeur(refreshTokenDto.getCode())
        .orElseThrow(()-> new RuntimeException("REFRESH-TOKEN INCONU"));
        
        SignupResponseDto tokens=  this.generateAndSaveToken(jwt.getUserx());
        refresh.setExpire(true);
        this.refreshTokenRepository.save(refresh);
        
        return tokens; }
     
//deconnexion d'un User ou Admin 
     public ResponseEntity<ResponseDto> deconex() {
    try {
        Userx user =  (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Jwt> jwtOpt = jwtRepository.findByUserxAndExpirationFalseAndDesactiveFalse(user);

        if (jwtOpt.isPresent()) {
            Jwt jwt = jwtOpt.get();

            if (!jwt.getDesactive() && !jwt.getExpiration()) {
                disableToken(user);
                jwt.getRefreshToken().setExpire(true);
                refreshTokenRepository.save(jwt.getRefreshToken());
                this.userxRepository.save(user);

                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(new ResponseDto(200, user.getUsername() + " EST DECONNECTE",""));
            } else {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDto(401, user.getUsername() + " EST DEJA DECONNECTE",""));
            }
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto(404, "JWT introuvable pour l'utilisateur",""));
        }
    } catch (Exception e) {
        log.error("Erreur lors de la déconnexion : {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDto(500, e.getMessage(),""));
    }
}




 @Value("${jwt.key}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generateToken(Userx userx) {
        return Jwts.builder()
                .setSubject(userx.getEmail())
                .claim("role", userx.getRole())
                .claim("communeId", userx.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public Boolean isTokenExpired(String token) {
        return getClaim(token, Claims::getExpiration).before(new Date());
    }

    public String extractUsername(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public Long getJwtExpiration() {
        return jwtExpiration;
    }

    public void setJwtExpiration(Long jwtExpiration) {
        this.jwtExpiration = jwtExpiration;
    }



}
