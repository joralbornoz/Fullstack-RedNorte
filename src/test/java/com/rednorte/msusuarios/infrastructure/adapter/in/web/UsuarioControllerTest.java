package com.rednorte.msusuarios.infrastructure.adapter.in.web;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.domain.model.Role;
import com.rednorte.msusuarios.domain.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private GestionarUsuarioUseCase gestionarUsuarioUseCase;

    @InjectMocks
    private UsuarioController usuarioController;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        usuarioPrueba = new Usuario(
                "1", "12345678-9", "test@rednorte.com", "encodedPassword",
                "Juan Perez", LocalDate.of(1990, 1, 1), "+56912345678", Role.PACIENTE
        );
    }

    @Test
    void crearUsuario_retornaStatusCreatedYUsuario() {
        when(gestionarUsuarioUseCase.crearUsuario(any(Usuario.class))).thenReturn(usuarioPrueba);

        ResponseEntity<Usuario> response = usuarioController.crearUsuario(usuarioPrueba);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(usuarioPrueba, response.getBody());
        verify(gestionarUsuarioUseCase, times(1)).crearUsuario(usuarioPrueba);
    }

    @Test
    void obtenerUsuario_retornaStatusOkYUsuario() {
        String rut = "12345678-9";
        when(gestionarUsuarioUseCase.obtenerUsuarioPorRut(rut)).thenReturn(usuarioPrueba);

        ResponseEntity<Usuario> response = usuarioController.obtenerUsuario(rut);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(usuarioPrueba, response.getBody());
        verify(gestionarUsuarioUseCase, times(1)).obtenerUsuarioPorRut(rut);
    }

    @Test
    void obtenerTodos_retornaStatusOkYListaDeUsuarios() {
        List<Usuario> listaUsuarios = Arrays.asList(usuarioPrueba);
        when(gestionarUsuarioUseCase.obtenerTodosLosUsuarios()).thenReturn(listaUsuarios);

        ResponseEntity<List<Usuario>> response = usuarioController.obtenerTodos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(listaUsuarios, response.getBody());
        verify(gestionarUsuarioUseCase, times(1)).obtenerTodosLosUsuarios();
    }

    @Test
    void actualizarUsuario_retornaStatusOkYUsuarioActualizado() {
        String rut = "12345678-9";
        when(gestionarUsuarioUseCase.actualizarUsuario(eq(rut), any(Usuario.class))).thenReturn(usuarioPrueba);

        ResponseEntity<Usuario> response = usuarioController.actualizarUsuario(rut, usuarioPrueba);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(usuarioPrueba, response.getBody());
        verify(gestionarUsuarioUseCase, times(1)).actualizarUsuario(rut, usuarioPrueba);
    }

    @Test
    void eliminarUsuario_retornaStatusNoContent() {
        String rut = "12345678-9";

        ResponseEntity<Void> response = usuarioController.eliminarUsuario(rut);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(gestionarUsuarioUseCase, times(1)).eliminarUsuario(rut);
    }

    @Test
    void verificarExistencia_cuandoExiste_retornaOkTrue() {
        String rut = "12345678-9";
        when(gestionarUsuarioUseCase.obtenerUsuarioPorRut(rut)).thenReturn(usuarioPrueba);

        ResponseEntity<Boolean> response = usuarioController.verificarExistencia(rut);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
    }

    @Test
    void verificarExistencia_cuandoNoExiste_retornaOkFalse() {
        String rut = "nonexistent";
        when(gestionarUsuarioUseCase.obtenerUsuarioPorRut(rut)).thenThrow(new RuntimeException("Not found"));

        ResponseEntity<Boolean> response = usuarioController.verificarExistencia(rut);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody());
    }
}
