package com.rednorte.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        // Este bean es el que inyectará el constructor de clientes HTTP
        // en tu AuthController para llamar al Microservicio de Usuarios.
        return WebClient.builder();
    }
}