package com.rednorte.apigateway.util; // <--- Nombre corregido

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component // PATRÓN SINGLETON: Spring crea una sola instancia para toda la app
public class JwtUtil {

    // Esta llave debe ser EXACTAMENTE la misma en el Microservicio de Usuarios
    public static final String SECRET = "RedNorteSaludGestionDeListasDeEspera2026SuperSecreta";

    public void validateToken(final String token) {
        // Si el token es falso o expiró, este método lanza una excepción que el filtro atrapará
        Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token);
    }

    private Key getSignKey() {
        byte[] keyBytes = SECRET.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}