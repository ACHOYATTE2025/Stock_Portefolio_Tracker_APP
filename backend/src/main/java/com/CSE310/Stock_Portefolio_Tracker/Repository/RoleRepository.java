package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Role;
import com.CSE310.Stock_Portefolio_Tracker.Enum.TypeRole;



@Repository
public interface RoleRepository extends  JpaRepository<Role, Long> {

   Optional < Role> findByLibele(TypeRole libele);

}
