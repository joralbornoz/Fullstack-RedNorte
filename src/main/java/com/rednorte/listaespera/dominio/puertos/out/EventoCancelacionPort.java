package com.rednorte.listaespera.dominio.puertos.out;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;

public interface EventoCancelacionPort {
    void publicarEvento(RegistroEspera registro);
}