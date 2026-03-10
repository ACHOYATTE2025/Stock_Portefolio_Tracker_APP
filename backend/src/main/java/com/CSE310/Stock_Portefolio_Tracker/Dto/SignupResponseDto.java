package com.CSE310.Stock_Portefolio_Tracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponseDto {

    private String token;
    private String refresh;

}
