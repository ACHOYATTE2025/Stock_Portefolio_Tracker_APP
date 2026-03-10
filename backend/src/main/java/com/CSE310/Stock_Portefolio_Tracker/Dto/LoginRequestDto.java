package com.CSE310.Stock_Portefolio_Tracker.Dto;

import org.hibernate.validator.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginRequestDto {
    
  @NotBlank
  private String email;

  @NotBlank
  private String password;

}
