package com.rednorte.msbff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // 🏗️ Bean 1: Entrega el constructor (Builder) que requiere 'ExternalServiceClient'
    @Bean
    public WebClient.Builder webClientBuilder() {
        System.out.println("🧱 [Config] Cargando Bean de WebClient.Builder para ExternalServiceClient...");
        return WebClient.builder();
    }

    // 🛰️ Bean 2: Entrega el cliente armado (WebClient) que requiere tu 'BffService'
    @Bean
    @Primary // Evita conflictos de inyección duplicada en Spring
    public WebClient webClient(WebClient.Builder builder) {
        System.out.println("🛰️ [Config] Cargando Bean de WebClient consolidado para BffService...");
        return builder.build(); // Crea la instancia usando el builder de arriba
    }
}