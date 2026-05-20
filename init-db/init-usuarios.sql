USE rednorte_usuarios;

INSERT INTO usuarios (rut, email, contrasena, nombre_completo, fecha_nacimiento, numero_telefono, rol) VALUES

-- ADMINISTRADORES (contraseña: Admin123!)
('11111111-1', 'admin.garcia@rednorte.cl', '$2a$10$N.IIrCEKBBVNScrBPKvxpOlwEnR4Uo4U8QRmGnP2Gv.UCiwdDPdAK', 'Carlos García Soto', '1980-03-15', '+56911111111', 'ADMIN'),
('22222222-2', 'admin.morales@rednorte.cl', '$2a$10$N.IIrCEKBBVNScrBPKvxpOlwEnR4Uo4U8QRmGnP2Gv.UCiwdDPdAK', 'Ana Morales Pérez', '1975-07-22', '+56922222222', 'ADMIN'),

-- MÉDICOS (contraseña: Medico123!)
('33333333-3', 'dr.carrasco@rednorte.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Juan Carrasco López', '1978-05-10', '+56933333333', 'MEDICO'),
('44444444-4', 'dra.silva@rednorte.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dra. María Silva Torres', '1982-09-18', '+56944444444', 'MEDICO'),
('55555555-5', 'dr.mendoza@rednorte.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Roberto Mendoza Vega', '1976-12-03', '+56955555555', 'MEDICO'),
('66666666-6', 'dra.rojas@rednorte.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dra. Patricia Rojas Muñoz', '1985-04-25', '+56966666666', 'MEDICO'),

-- PACIENTES (contraseña: Paciente123!)
('77777777-7', 'p.gonzalez@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'María González Ríos', '1990-06-14', '+56977777777', 'PACIENTE'),
('88888888-8', 'p.martinez@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Pedro Martínez Cruz', '1985-11-30', '+56988888888', 'PACIENTE'),
('99999999-9', 'p.flores@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Valentina Flores Soto', '1995-02-08', '+56999999999', 'PACIENTE'),
('10101010-1', 'p.herrera@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Diego Herrera Pinto', '1988-08-19', '+56910101010', 'PACIENTE'),
('12121212-1', 'p.castillo@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Camila Castillo Vera', '1992-04-03', '+56912121212', 'PACIENTE'),
('13131313-3', 'p.ramirez@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Sebastián Ramírez Lagos', '1987-09-27', '+56913131313', 'PACIENTE'),
('14141414-4', 'p.vargas@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Fernanda Vargas Díaz', '1993-01-15', '+56914141414', 'PACIENTE'),
('15151515-5', 'p.reyes@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Andrés Reyes Fuentes', '1991-07-22', '+56915151515', 'PACIENTE'),
('16161616-6', 'p.navarro@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Catalina Navarro Espinoza', '1996-03-11', '+56916161616', 'PACIENTE'),
('17171717-7', 'p.perez@gmail.com', '$2a$10$TbNc5ECR4AF5pQv0rNOvI.PoQZ0Jnl.D3GtnP5k5kD1ZTy.HWMYC', 'Matías Pérez Contreras', '1989-12-05', '+56917171717', 'PACIENTE');