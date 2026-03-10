package com.CSE310.Stock_Portefolio_Tracker.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.CSE310.Stock_Portefolio_Tracker.Services.AuthService;
import com.CSE310.Stock_Portefolio_Tracker.Services.JwtService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthentificationFilter extends  OncePerRequestFilter{
    private final JwtService jwtService;
    private final AuthService authService;

    @Override
        protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain) throws ServletException, IOException {

            String header = request.getHeader("Authorization");

            // 🔒 Pas de token → on laisse passer
            if (header == null || !header.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            

            // 🔒 Déjà authentifié
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            try {
                String token = header.substring(7);

                Claims claims = jwtService.extractAllClaims(token);
                String email = claims.getSubject();
                            // 👇 Et ceci
                log.info("EMAIL EXTRAIT : {}", claims.getSubject());
                log.info("EXPIRATION : {}", claims.getExpiration());

                UserDetails userDetails =
                        authService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                auth.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );
                

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }

            filterChain.doFilter(request, response);
        }





}
