package com.rednorte.msusuarios.infrastructure.security;

import com.rednorte.msusuarios.application.ports.out.TokenGeneratorPort;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService implements TokenGeneratorPort { // <-- Aquí conectamos el Adaptador con el Puerto

    // IMPORTANTE: Esta clave DEBE ser idéntica a la del API Gateway
    public static final String SECRET = "RedNorteSaludGestionDeListasDeEspera2026SuperSecreta";

    /**
     * Genera un token para un usuario específico.
     * @param rut El identificador único del usuario (RUT).
     * @return El token JWT firmado.
     */
    @Override // <-- Confirmamos que estamos sobrescribiendo el método del Puerto
    public String generateToken(String rut, String rol) {
        Map<String, Object> claims = new HashMap<>();
        // Aquí puedes agregar información extra que el Gateway o el Frontend necesiten
        claims.put("organización", "RedNorte");
        claims.put("role", rol);

        return createToken(claims, rut);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        // Tiempo de expiración: 10 horas (1000ms * 60s * 60m * 10h)
        long expirationTime = 1000L * 60 * 60 * 10;

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = SECRET.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}