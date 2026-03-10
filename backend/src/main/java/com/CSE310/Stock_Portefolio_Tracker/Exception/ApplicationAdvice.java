package com.CSE310.Stock_Portefolio_Tracker.Exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.CSE310.Stock_Portefolio_Tracker.Dto.ErroResponseDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ApplicationAdvice {
   

    //manage all exception !!!!!
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponseDto> exceptionHandler(Exception exception,WebRequest webRequest){
        ErroResponseDto errorDto= new ErroResponseDto(
        webRequest.getDescription(false),
        HttpStatus.BAD_REQUEST ,
        exception.getMessage(),
        LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(errorDto);
            
            
    }
}