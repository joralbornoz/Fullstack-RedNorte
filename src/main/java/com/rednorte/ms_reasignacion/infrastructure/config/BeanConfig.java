package com.rednorte.ms_reasignacion.infrastructure.config;

import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.application.ports.in.ProcesarCitaCanceladaUseCase;
import com.rednorte.ms_reasignacion.application.ports.out.CitaCanceladaEventPort;
import com.rednorte.ms_reasignacion.application.service.CitaCanceladaService;
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

    @Bean
    public ProcesarCitaCanceladaUseCase procesarCitaCanceladaUseCase(
            ReasignacionRepository repository,
            CitaCanceladaEventPort eventPort) {
        return new CitaCanceladaService(repository, eventPort);
    }
}