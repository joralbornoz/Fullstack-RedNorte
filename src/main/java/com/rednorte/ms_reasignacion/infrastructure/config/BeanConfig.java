package com.rednorte.ms_reasignacion.infrastructure.config;

import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.application.service.ReasignacionService;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public CrearReasignacionUseCase reasignacionUseCase(ReasignacionRepository repository) {
        return new ReasignacionService(repository);
    }
}