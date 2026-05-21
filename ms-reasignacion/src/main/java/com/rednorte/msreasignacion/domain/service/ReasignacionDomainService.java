package com.rednorte.msreasignacion.domain.service;

import com.rednorte.msreasignacion.domain.model.PacienteCandidato;
import org.springframework.stereotype.Service;

@Service
public class ReasignacionDomainService {

    // Regla de negocio: Solo reasignamos si el paciente tiene prioridad "ALTA" o "URGENTE"
    public boolean esCandidatoValido(PacienteCandidato candidato) {
        if (candidato == null) return false;
        String p = candidato.getPrioridad().toUpperCase();
        return p.equals("ALTA") || p.equals("URGENTE");
    }
}