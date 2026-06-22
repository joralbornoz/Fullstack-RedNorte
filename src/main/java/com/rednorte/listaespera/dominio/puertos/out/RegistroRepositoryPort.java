package com.rednorte.listaespera.dominio.puertos.out;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import java.util.List;
import java.util.Optional;

public interface RegistroRepositoryPort {
    RegistroEspera guardar(RegistroEspera registro);
    List<RegistroEspera> buscarTodos();
    List<RegistroEspera> buscarPorRut(String rut);
    Optional<RegistroEspera> buscarPorId(Long id); // Para el GET individual y el PUT
    void eliminar(Long id);
    Optional<RegistroEspera> obtenerSiguiente(String especialidad);// Para el DELETE
}