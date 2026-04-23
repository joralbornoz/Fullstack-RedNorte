package com.rednorte.listaespera.dominio.modelo;

public interface EstadoEspera {
    void cancelar(RegistroEspera registro);
    void asignar(RegistroEspera registro);
    String getNombreEstado();
}


