package com.rednorte.msusuarios.infrastructure.adapter.in.web;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.domain.model.Role;
import com.rednorte.msusuarios.domain.model.Usuario;
import com.rednorte.msusuarios.infrastructure.adapter.in.web.dto.LoginRequest;
import com.rednorte.msusuarios.infrastructure.adapter.in.web.dto.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private GestionarUsuarioUseCase gestionarUsuarioUseCase;

    @InjectMocks
    private AuthController authController;

    private Usuario usuarioPrueba;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        usuarioPrueba = new Usuario(
                "1", "12345678-9", "test@rednorte.com", "encodedPassword",
                "Juan Perez", LocalDate.of(1990, 1, 1), "+56912345678", Role.ADMIN
        );
        loginRequest = new LoginRequest("12345678-9", "mypassword");
    }

    @Test
    void login_cuandoCredencialesSonValidas_retornaOkConLoginResponse() {
        when(gestionarUsuarioUseCase.validarCredenciales(loginRequest.rut(), loginRequest.contrasena())).thenReturn(true);
        when(gestionarUsuarioUseCase.obtenerUsuarioPorRut(loginRequest.rut())).thenReturn(usuarioPrueba);

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof LoginResponse);
        LoginResponse loginResponse = (LoginResponse) response.getBody();
        assertEquals("12345678-9", loginResponse.rut());
        assertEquals("ADMIN", loginResponse.rol());
        verify(gestionarUsuarioUseCase, times(1)).validarCredenciales(loginRequest.rut(), loginRequest.contrasena());
        verify(gestionarUsuarioUseCase, times(1)).obtenerUsuarioPorRut(loginRequest.rut());
    }

    @Test
    void login_cuandoCredencialesSonInvalidas_retornaUnauthorized() {
        when(gestionarUsuarioUseCase.validarCredenciales(loginRequest.rut(), loginRequest.contrasena())).thenReturn(false);

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("RUT o contraseña incorrectos", response.getBody());
        verify(gestionarUsuarioUseCase, times(1)).validarCredenciales(loginRequest.rut(), loginRequest.contrasena());
        verify(gestionarUsuarioUseCase, never()).obtenerUsuarioPorRut(anyString());
    }
}
