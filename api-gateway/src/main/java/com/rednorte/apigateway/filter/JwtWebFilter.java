package com.rednorte.apigateway.filter;

import com.rednorte.apigateway.config.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collections;

@Component
public class JwtWebFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    public JwtWebFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                // 1. Validamos la firma digital del token de forma stateless
                jwtUtil.validateToken(token);

                // 2. Extraemos los datos del payload
                String username = jwtUtil.extractUsername(token);
                String rol = jwtUtil.extractRole(token);

                // 3. Formateamos el rol con el prefijo obligatorio de Spring Security
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase());

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(authority)
                );

                // 4. Inyectamos la identidad al contexto reactivo antes de que pase a las rutas
                return chain.filter(exchange)
                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));

            } catch (Exception e) {
                System.err.println("❌ Error de autenticación en JwtWebFilter: " + e.getMessage());
            }
        }
        return chain.filter(exchange);
    }
}