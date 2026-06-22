package com.rednorte.lista_espera.infraestructura.adaptadores.salida;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import com.rednorte.listaespera.infraestructura.adaptadores.salida.RegistroPersistenceAdapter;
import com.rednorte.listaespera.infraestructura.adaptadores.salida.MySqlRegistroRepository;
import com.rednorte.listaespera.infraestructura.adaptadores.salida.RegistroEntidad;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistroPersistenceAdapterTest {

    @Mock
    private MySqlRegistroRepository repository;

    @InjectMocks
    private RegistroPersistenceAdapter adapter;

    private RegistroEntidad entidad;
    private RegistroEspera dominio;

    @BeforeEach
    void setUp() {
        entidad = new RegistroEntidad();
        entidad.setId(1L);
        entidad.setRutPaciente("12345678-9");
        entidad.setEspecialidadDestino("CARDIOLOGIA");
        entidad.setEstado("PENDIENTE");
        entidad.setFechaIngreso(LocalDate.now());

        dominio = new RegistroEspera();
        dominio.setId(1L);
        dominio.setRutPaciente("12345678-9");
        dominio.setEspecialidadDestino("CARDIOLOGIA");
        dominio.setEstado("PENDIENTE");
        dominio.setFechaIngreso(LocalDate.now());
    }

    @Test
    @DisplayName("CP14 - Debería mapear correctamente a entidad relacional y persistir en MySQL")
    void guardarExitoso() {
        when(repository.save(any(RegistroEntidad.class))).thenReturn(entidad);

        RegistroEspera resultado = adapter.guardar(dominio);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(repository, times(1)).save(any(RegistroEntidad.class));
    }

    @Test
    @DisplayName("CP15 - Debería consultar el repositorio usando paginación y retornar el primer dominio")
    void obtenerSiguienteExitoso() {
        when(repository.buscarCandidatoTop("CARDIOLOGIA", PageRequest.of(0, 1)))
                .thenReturn(Collections.singletonList(entidad));

        Optional<RegistroEspera> resultado = adapter.obtenerSiguiente("CARDIOLOGIA");

        assertTrue(resultado.isPresent());
        assertEquals("12345678-9", resultado.get().getRutPaciente());
    }
}