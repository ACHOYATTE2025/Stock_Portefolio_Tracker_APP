package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Jwt;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;

@Repository
public interface JwtRepository  extends  CrudRepository<Jwt, Long>{

    Optional<Jwt> findByValeur(String valeur);

    void deleteByExpirationAndDesactive(Boolean expiration,Boolean desactive);

    void deleteByValeur(String valeur);

    @Query("FROM Jwt j WHERE  j.userx.email=:email and j.desactive= :expire and j.expiration=: expire" )
    Optional <Jwt> findBytoken(String email, Boolean desactive,Boolean expire);

    @Query("FROM Jwt j WHERE  j.userx.email=:email")
    Stream <Jwt>  findByUserx(String email);

    @Query("FROM Jwt j WHERE  j.refreshToken.valeur=:valeur")
    Optional <Jwt> findByRefreshToken(String valeur);


    void deleteAllByValeur(String valeur);

    Optional<Jwt>  findByUserx(Userx userx);

    Optional<Jwt> findByUserxAndExpirationFalseAndDesactiveFalse(Userx userx);


}
