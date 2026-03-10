package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;


@Repository
public interface UserxRepository extends  JpaRepository<Userx, Long>{
    Optional<Userx> findByUsername(String username);
    Optional<Userx> findByEmail(String email);
    boolean existsByEmail(String email);


}
