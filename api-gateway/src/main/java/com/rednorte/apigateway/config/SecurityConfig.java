package com.rednorte.apigateway.config;

import com.rednorte.apigateway.filter.JwtWebFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtWebFilter jwtWebFilter;

    public SecurityConfig(JwtWebFilter jwtWebFilter) {
        this.jwtWebFilter = jwtWebFilter;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Conectamos la aduana del JwtWebFilter justo en la etapa de Autenticación
                .addFilterAt(jwtWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)

                .authorizeExchange(exchanges -> exchanges
                        // Permitir preflights de CORS
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()

                        // Rutas de autenticación pública (Generación inicial del token)
                        .pathMatchers("/api/v1/auth/**").permitAll()
                        .pathMatchers("/api/v1/usuarios/auth/**").permitAll()

                        // Rutas de Pacientes (Tienen acceso: PACIENTE, MEDICO y ADMIN)
                        .pathMatchers("/api/v1/lista-espera/paciente/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MEDICO", "ROLE_PACIENTE")
                        .pathMatchers("/api/v1/bff/paciente/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MEDICO", "ROLE_PACIENTE")

                        // Gestión Médica General (Solo entran MEDICOS y ADMINS)
                        .pathMatchers("/api/v1/lista-espera/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MEDICO")
                        .pathMatchers("/api/v1/reasignacion/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MEDICO")
                        .pathMatchers("/api/v1/usuarios/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MEDICO")

                        // Administración Pura (Solo entra el ADMIN)
                        .pathMatchers("/api/v1/admin/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers("/api/v1/bff/admin/**").hasAuthority("ROLE_ADMIN")

                        // Cualquier otro recurso requiere autenticación mínima
                        .anyExchange().authenticated()
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}