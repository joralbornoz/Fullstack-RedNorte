package com.rednorte.apigateway.filter;

import com.rednorte.apigateway.util.JwtUtil; // <--- Importamos tu utilidad
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilterFactory extends AbstractGatewayFilterFactory<JwtAuthenticationFilterFactory.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilterFactory(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    // ====== ESTA ES LA SOLUCIÓN DEFINITIVA ======
    // Obligamos a Spring a reconocer este filtro exactamente con el
    // nombre que pusimos en el application.yml, sin importar cómo se llame la clase.
    @Override
    public String name() {
        return "JwtAuthenticationFilter";
    }
    // ============================================

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            // 2. Verificar si la petición tiene el header de Autorización
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);

            // 3. Verificar formato Bearer
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                // 4. USAR LA UTILIDAD PARA VALIDAR LA FIRMA REAL
                // Si la firma es falsa o el token expiró, saltará al catch automáticamente
                jwtUtil.validateToken(token);

                // Si llegamos aquí, el token es válido. La petición sigue al microservicio.
                return chain.filter(exchange);

            } catch (Exception e) {
                // Rechazamos la petición si el token no es válido
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
    }
}