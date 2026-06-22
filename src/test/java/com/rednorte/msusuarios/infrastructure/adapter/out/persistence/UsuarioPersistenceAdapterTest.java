package com.rednorte.msusuarios.infrastructure.adapter.out.persistence;

import com.rednorte.msusuarios.domain.model.Role;
import com.rednorte.msusuarios.domain.model.Usuario;
import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioPersistenceAdapterTest {

    @Mock
    private UsuarioJpaRepository repository;

    @InjectMocks
    private UsuarioPersistenceAdapter adapter;

    private Usuario usuarioDominio;
    private UsuarioJpaEntity usuarioEntity;

    @BeforeEach
    void setUp() {
        usuarioDominio = new Usuario(
                "1", "12345678-9", "test@rednorte.com", "encodedPassword",
                "Juan Perez", LocalDate.of(1990, 1, 1), "+56912345678", Role.PACIENTE
        );

        usuarioEntity = new UsuarioJpaEntity(
                1L, "12345678-9", "test@rednorte.com", "encodedPassword",
                "Juan Perez", LocalDate.of(1990, 1, 1), "+56912345678", Role.PACIENTE
        );
    }

    @Test
    void buscarPorRut_cuandoExiste_retornaUsuario() {
        String rut = "12345678-9";
        when(repository.findByRut(rut)).thenReturn(Optional.of(usuarioEntity));

        Optional<Usuario> resultado = adapter.buscarPorRut(rut);

        assertTrue(resultado.isPresent());
        assertEquals(rut, resultado.get().getRut());
        verify(repository, times(1)).findByRut(rut);
    }

    @Test
    void buscarPorRut_cuandoNoExiste_retornaVacio() {
        String rut = "nonexistent";
        when(repository.findByRut(rut)).thenReturn(Optional.empty());

        Optional<Usuario> resultado = adapter.buscarPorRut(rut);

        assertFalse(resultado.isPresent());
        verify(repository, times(1)).findByRut(rut);
    }

    @Test
    void guardar_convierteEntityLoGuardaYRetornaUsuario() {
        when(repository.save(any(UsuarioJpaEntity.class))).thenReturn(usuarioEntity);

        Usuario resultado = adapter.guardar(usuarioDominio);

        assertNotNull(resultado);
        assertEquals(usuarioDominio.getRut(), resultado.getRut());
        verify(repository, times(1)).save(any(UsuarioJpaEntity.class));
    }

    @Test
    void findAll_retornaListaDeUsuarios() {
        when(repository.findAll()).thenReturn(Arrays.asList(usuarioEntity));

        List<Usuario> resultado = adapter.findAll();

        assertEquals(1, resultado.size());
        assertEquals("12345678-9", resultado.get(0).getRut());
        verify(repository, times(1)).findAll();
    }

    @Test
    void eliminar_cuandoExisteEntidad_llamaDelete() {
        String rut = "12345678-9";
        when(repository.findByRut(rut)).thenReturn(Optional.of(usuarioEntity));

        adapter.eliminar(usuarioDominio);

        verify(repository, times(1)).findByRut(rut);
        verify(repository, times(1)).delete(usuarioEntity);
    }

    @Test
    void eliminar_cuandoNoExisteEntidad_noLlamaDelete() {
        String rut = "12345678-9";
        when(repository.findByRut(rut)).thenReturn(Optional.empty());

        adapter.eliminar(usuarioDominio);

        verify(repository, times(1)).findByRut(rut);
        verify(repository, never()).delete(any());
    }
}
