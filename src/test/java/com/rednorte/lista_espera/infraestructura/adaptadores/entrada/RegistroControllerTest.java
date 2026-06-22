package com.rednorte.lista_espera.infraestructura.adaptadores.entrada;

import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.CancelarRequest;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroCompletoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.RegistroController;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistroControllerTest {

    @Mock
    private GestionListaEsperaService service;

    @InjectMocks
    private RegistroController controller;

    private RegistroCompletoDTO dtoEjemplo;

    @BeforeEach
    void setUp() {
        dtoEjemplo = new RegistroCompletoDTO(1L, "12345678-9", "PEDIATRIA", "Control", "2", "PENDIENTE", LocalDate.now());
    }

    @Test
    @DisplayName("CP11 - Debería retornar 200 OK con el DTO si existe un siguiente candidato")
    void obtenerSiguienteExistente() {
        when(service.obtenerSiguiente("PEDIATRIA")).thenReturn(Optional.of(dtoEjemplo));

        ResponseEntity<RegistroCompletoDTO> respuesta = controller.obtenerSiguiente("PEDIATRIA");

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
    }

    @Test
    @DisplayName("CP12 - Debería retornar 204 No Content si la lista para la especialidad está vacía")
    void obtenerSiguienteVacio() {
        when(service.obtenerSiguiente("PEDIATRIA")).thenReturn(Optional.empty());

        ResponseEntity<RegistroCompletoDTO> respuesta = controller.obtenerSiguiente("PEDIATRIA");

        assertEquals(HttpStatus.NO_CONTENT, respuesta.getStatusCode());
    }

    @Test
    @DisplayName("CP13 - Debería retornar 200 OK al procesar una cancelación válida")
    void cancelarCitaEndpoint() {
        CancelarRequest request = new CancelarRequest();
        request.setIdInterconsulta(1L);
        request.setMotivo("Error operativo");
        request.setCanceladoPor("MEDICO");

        doNothing().when(service).cancelarCita(1L, "Error operativo", "MEDICO");

        ResponseEntity<Void> respuesta = controller.cancelarCita(request);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        verify(service, times(1)).cancelarCita(1L, "Error operativo", "MEDICO");
    }
}