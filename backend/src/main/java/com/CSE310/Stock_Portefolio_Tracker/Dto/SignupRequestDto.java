package com.CSE310.Stock_Portefolio_Tracker.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class SignupRequestDto {
    
  @NotBlank
  private String username;

  @NotBlank
  private String email;

  @NotBlank
  private String password;


}
