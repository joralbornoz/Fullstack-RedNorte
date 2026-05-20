package com.rednorte.listaespera.infraestructura.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ConfiguracionSeguridad {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/lista-espera/todos",
                                "/api/v1/lista-espera/paciente/**",
                                "/api/v1/lista-espera/*/estado",
                                "/api/v1/lista-espera/siguiente",
                                "/api/v1/lista-espera/actualizar/**",
                                // 🔥 AÑADIDO: Permitimos el acceso público para probar el flujo de cancelación
                                "/api/v1/lista-espera/cancelar"
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}