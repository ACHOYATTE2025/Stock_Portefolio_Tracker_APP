package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.RefreshToken;

@Repository
public interface RefreshTokenRepository extends  CrudRepository<RefreshToken, Long>{

     Optional <RefreshToken> findByValeur(String valeur);

}
