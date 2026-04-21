package com.rednorte.listaespera.dominio.puertos.out;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import java.util.List;

public interface RegistroRepositoryPort {
    RegistroEspera guardar(RegistroEspera registro);
    List<RegistroEspera> buscarTodos();
    
}