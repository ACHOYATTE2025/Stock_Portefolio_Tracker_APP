package com.CSE310.Stock_Portefolio_Tracker.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CSE310.Stock_Portefolio_Tracker.Dto.ErroResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.LoginRequestDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.RefreshTokenDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.ResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.SignupRequestDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.SignupResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Services.AuthService;
import com.CSE310.Stock_Portefolio_Tracker.Services.JwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(
  name = "Stock Tracker Authentification",
  description="AUTHENTIFICATION REST Api in Stock tracker management APP to CREATE  details"
)
@RequiredArgsConstructor
@Slf4j
@RestController
public class AuthController {
    
private  final AuthService authService;
private final AuthenticationManager authenticationManager;
private final JwtService jwtService;


    //User registration
  
//create
  @Operation(
    summary="REST API to create new User in Stock Tracker mangement",
    description = "REST API to create new Account  inside Stock Tracker mangement "
  )

  @ApiResponse(
    responseCode="201",
    description = "USER CREATED SUCCESSFULLY"
  )
  @PostMapping(value="/register",
              produces = MediaType.APPLICATION_JSON_VALUE
            )
  public ResponseEntity<ResponseDto> registerUser( @RequestBody @Valid SignupRequestDto request)throws Exception {
         this.authService.RegisterUserService(request);
         return ResponseEntity
            .status(HttpStatus.CREATED)
            .contentType(MediaType.APPLICATION_JSON)
            .body(new ResponseDto(201,"USER CREATED SUCCESSFULLY",""));
       
  }


  //login

  @Operation(
    summary="REST API to login  user or User into stock portefolio tracker app",
    description = "REST API to user to login stock portefolio tracker app"
  )

  @ApiResponses({
    @ApiResponse(
        responseCode="200",
        description = "HTTP Status DONE",
        content = @Content(
            schema = @Schema(implementation = ResponseDto.class)) ),
    
    @ApiResponse(   

        description = "Login  failed!!!",
        content = @Content(
            schema = @Schema(implementation = ErroResponseDto.class)
        )
    )
    }
  )
@PostMapping("/login")
 public ResponseEntity<?> login( @RequestBody LoginRequestDto request) {
    log.info("Email reçu: " + request.getEmail());
    log.info("Password reçu: " + request.getPassword());

         try {
              Authentication authentication = authenticationManager.authenticate(
                  new UsernamePasswordAuthenticationToken(
                      request.getEmail(),
                      request.getPassword()
                  )
        );

              Userx user = (Userx) authentication.getPrincipal();
              SignupResponseDto tokens = jwtService.generateAndSaveToken(user);

              return ResponseEntity
                  .ok()
                  .contentType(MediaType.APPLICATION_JSON)
                  .body(tokens);

    } catch (AuthenticationException ex) {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .contentType(MediaType.APPLICATION_JSON)
            .body(new ResponseDto(401, "LOGIN ERROR", "BAD CREDENTIALS"));
    }
                
    }




    

//refresh Token
@Operation(
    summary="REST API to make refreshtoken  into stock portefolio tracker app",
    description = "REST API to make refreshtoken   into stock portefolio tracker app"
  )
//@PreAuthorize("hasAnyRole('USER,ADMIN')")
  @PostMapping("/refreshtoken")
  public  SignupResponseDto refreshToken(@RequestBody RefreshTokenDto refreshTokenRequest) {
       return this.jwtService.refreshtoken(refreshTokenRequest);
       }

}


