package com.rednorte.msusuarios.application.service;

import com.rednorte.msusuarios.application.ports.out.UsuarioRepositoryPort;
import com.rednorte.msusuarios.domain.model.Role;
import com.rednorte.msusuarios.domain.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepositoryPort usuarioRepositoryPort;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId("1");
        usuarioPrueba.setRut("12345678-9");
        usuarioPrueba.setEmail("test@rednorte.com");
        usuarioPrueba.setContrasena("encodedPassword");
        usuarioPrueba.setNombreCompleto("Juan Perez");
        usuarioPrueba.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        usuarioPrueba.setNumeroTelefono("+56912345678");
        usuarioPrueba.setRol(Role.PACIENTE);
    }

    @Test
    void validarCredenciales_cuandoCredencialesValidas_retornaTrue() {
        // Arrange (Configuración)
        String rut = "12345678-9";
        String contrasenaPlana = "123456";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.of(usuarioPrueba));
        when(passwordEncoder.matches(contrasenaPlana, "encodedPassword")).thenReturn(true);

        // Act (Ejecución)
        boolean resultado = usuarioService.validarCredenciales(rut, contrasenaPlana);

        // Assert (Verificación)
        assertTrue(resultado);
        verify(usuarioRepositoryPort, times(1)).buscarPorRut(rut);
        verify(passwordEncoder, times(1)).matches(contrasenaPlana, "encodedPassword");
    }

    @Test
    void validarCredenciales_cuandoCredencialesInvalidas_retornaFalse() {
        // Arrange
        String rut = "12345678-9";
        String contrasenaInvalida = "wrongPassword";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.of(usuarioPrueba));
        when(passwordEncoder.matches(contrasenaInvalida, "encodedPassword")).thenReturn(false);

        // Act
        boolean resultado = usuarioService.validarCredenciales(rut, contrasenaInvalida);

        // Assert
        assertFalse(resultado);
    }

    @Test
    void validarCredenciales_cuandoUsuarioNoExiste_retornaFalse() {
        // Arrange
        String rut = "nonexistent";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.empty());

        // Act
        boolean resultado = usuarioService.validarCredenciales(rut, "anyPassword");

        // Assert
        assertFalse(resultado);
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void obtenerUsuarioPorRut_cuandoUsuarioExiste_retornaUsuario() {
        // Arrange
        String rut = "12345678-9";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        Usuario resultado = usuarioService.obtenerUsuarioPorRut(rut);

        // Assert
        assertNotNull(resultado);
        assertEquals(rut, resultado.getRut());
    }

    @Test
    void obtenerUsuarioPorRut_cuandoUsuarioNoExiste_lanzaExcepcion() {
        // Arrange
        String rut = "nonexistent";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.obtenerUsuarioPorRut(rut);
        });
        assertEquals("Usuario no encontrado con RUT: nonexistent", exception.getMessage());
    }

    @Test
    void crearUsuario_debeEncriptarContrasenaYGuardar() {
        // Arrange
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setRut("98765432-1");
        nuevoUsuario.setContrasena("plainPassword");
        nuevoUsuario.setNombreCompleto("Maria Lopez");

        Usuario usuarioEsperado = new Usuario();
        usuarioEsperado.setId("2");
        usuarioEsperado.setRut("98765432-1");
        usuarioEsperado.setContrasena("encodedPassword2");
        usuarioEsperado.setNombreCompleto("Maria Lopez");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword2");
        when(usuarioRepositoryPort.guardar(any(Usuario.class))).thenReturn(usuarioEsperado);

        // Act
        Usuario resultado = usuarioService.crearUsuario(nuevoUsuario);

        // Assert
        assertNotNull(resultado);
        assertEquals("encodedPassword2", nuevoUsuario.getContrasena());
        assertEquals("2", resultado.getId());
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(usuarioRepositoryPort, times(1)).guardar(nuevoUsuario);
    }

    @Test
    void actualizarUsuario_cuandoUsuarioExiste_actualizaCamposYGuarda() {
        // Arrange
        String rut = "12345678-9";
        Usuario datosActualizados = new Usuario();
        datosActualizados.setNombreCompleto("Juan Perez Modificado");
        datosActualizados.setNumeroTelefono("+56999999999");
        datosActualizados.setEmail("juan.perez@newdomain.com");

        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.of(usuarioPrueba));
        when(usuarioRepositoryPort.guardar(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Usuario resultado = usuarioService.actualizarUsuario(rut, datosActualizados);

        // Assert
        assertNotNull(resultado);
        assertEquals("Juan Perez Modificado", resultado.getNombreCompleto());
        assertEquals("+56999999999", resultado.getNumeroTelefono());
        assertEquals("juan.perez@newdomain.com", resultado.getEmail());
        verify(usuarioRepositoryPort, times(1)).guardar(usuarioPrueba);
    }

    @Test
    void obtenerTodosLosUsuarios_retornaListaDeUsuarios() {
        // Arrange
        List<Usuario> listaEsperada = Arrays.asList(usuarioPrueba);
        when(usuarioRepositoryPort.findAll()).thenReturn(listaEsperada);

        // Act
        List<Usuario> resultado = usuarioService.obtenerTodosLosUsuarios();

        // Assert
        assertEquals(1, resultado.size());
        assertEquals(usuarioPrueba, resultado.get(0));
    }

    @Test
    void eliminarUsuario_cuandoUsuarioExiste_llamaEliminar() {
        // Arrange
        String rut = "12345678-9";
        when(usuarioRepositoryPort.buscarPorRut(rut)).thenReturn(Optional.of(usuarioPrueba));

        // Act
        usuarioService.eliminarUsuario(rut);

        // Assert
        verify(usuarioRepositoryPort, times(1)).eliminar(usuarioPrueba);
    }
}
