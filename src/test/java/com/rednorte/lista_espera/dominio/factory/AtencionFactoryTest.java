package com.rednorte.lista_espera.dominio.factory;

import com.rednorte.listaespera.dominio.factory.AtencionFactory;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AtencionFactoryTest {

    @Test
    @DisplayName("CP07 - Debería asignar automáticamente Prioridad 3 si la especialidad es CARDIOLOGIA")
    void crearAtencionCardiologia() {
        RegistroEspera resultado = AtencionFactory.crearAtencion("11111111-1", "CARDIOLOGIA", "Dolor de pecho", "1");
        assertEquals("3", resultado.getPrioridad());
        assertEquals("PENDIENTE", resultado.getEstado());
    }

    @Test
    @DisplayName("CP08 - Debería respetar la prioridad manual provista si no es especialidad crítica")
    void crearAtencionPrioridadManual() {
        RegistroEspera resultado = AtencionFactory.crearAtencion("22222222-2", "DERMATOLOGIA", "Alergia", "2");
        assertEquals("2", resultado.getPrioridad());
    }

    @Test
    @DisplayName("CP09 - Debería asignar automáticamente Prioridad 2 si es TRAUMATOLOGIA y no hay prioridad manual")
    void crearAtencionTraumatologia() {
        RegistroEspera resultado = AtencionFactory.crearAtencion("33333333-3", "TRAUMATOLOGIA", "Fractura", "");
        assertEquals("2", resultado.getPrioridad());
    }

    @Test
    @DisplayName("CP10 - Debería asignar por defecto Prioridad 1 si no cumple ninguna condición anterior")
    void crearAtencionPorDefecto() {
        RegistroEspera resultado = AtencionFactory.crearAtencion("44444444-4", "OFTALMOLOGIA", "Vicio refracción", null);
        assertEquals("1", resultado.getPrioridad());
    }
}