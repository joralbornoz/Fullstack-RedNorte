USE db_lista_espera;

INSERT INTO registros_espera (rut_paciente, especialidad_destino, patologia_sospecha, prioridad, estado, fecha_ingreso, motivo_cancelacion, cancelado_por) VALUES

-- Paciente 77777777-7
('77777777-7', 'Cardiología', 'Arritmia cardíaca', 'ALTA', 'PENDIENTE', '2024-01-15', NULL, NULL),
('77777777-7', 'Neurología', 'Migraña crónica', 'MEDIA', 'CONFIRMADO', '2024-03-20', NULL, NULL),

-- Paciente 88888888-8
('88888888-8', 'Traumatología', 'Fractura de cadera', 'ALTA', 'PENDIENTE', '2024-02-10', NULL, NULL),
('88888888-8', 'Cardiología', 'Hipertensión severa', 'ALTA', 'PENDIENTE', '2024-04-05', NULL, NULL),

-- Paciente 99999999-9
('99999999-9', 'Gastroenterología', 'Úlcera gástrica', 'MEDIA', 'PENDIENTE', '2024-02-28', NULL, NULL),
('99999999-9', 'Neurología', 'Epilepsia', 'ALTA', 'PENDIENTE', '2024-01-30', NULL, NULL),

-- Paciente 10101010-1
('10101010-1', 'Traumatología', 'Lesión de rodilla', 'MEDIA', 'CONFIRMADO', '2024-03-12', NULL, NULL),
('10101010-1', 'Cardiología', 'Soplo cardíaco', 'BAJA', 'PENDIENTE', '2024-05-01', NULL, NULL),

-- Paciente 12121212-1
('12121212-1', 'Neurología', 'Esclerosis múltiple', 'ALTA', 'PENDIENTE', '2024-01-08', NULL, NULL),
('12121212-1', 'Gastroenterología', 'Colon irritable', 'BAJA', 'PENDIENTE', '2024-04-18', NULL, NULL),

-- Paciente 13131313-3
('13131313-3', 'Cardiología', 'Insuficiencia cardíaca', 'ALTA', 'PENDIENTE', '2024-02-05', NULL, NULL),
('13131313-3', 'Traumatología', 'Artritis severa', 'MEDIA', 'CANCELADO', '2024-03-01', 'Paciente no disponible', 'MEDICO'),

-- Paciente 14141414-4
('14141414-4', 'Neurología', 'Parkinson temprano', 'ALTA', 'PENDIENTE', '2024-01-20', NULL, NULL),
('14141414-4', 'Gastroenterología', 'Hepatitis crónica', 'MEDIA', 'PENDIENTE', '2024-05-10', NULL, NULL),

-- Paciente 15151515-5
('15151515-5', 'Traumatología', 'Hernia discal', 'MEDIA', 'CONFIRMADO', '2024-03-25', NULL, NULL),
('15151515-5', 'Cardiología', 'Taquicardia', 'ALTA', 'PENDIENTE', '2024-02-14', NULL, NULL),

-- Paciente 16161616-6
('16161616-6', 'Neurología', 'Accidente cerebrovascular', 'ALTA', 'PENDIENTE', '2024-01-05', NULL, NULL),
('16161616-6', 'Gastroenterología', 'Pancreatitis', 'ALTA', 'PENDIENTE', '2024-02-22', NULL, NULL),

-- Paciente 17171717-7
('17171717-7', 'Cardiología', 'Angina de pecho', 'ALTA', 'PENDIENTE', '2024-01-12', NULL, NULL),
('17171717-7', 'Traumatología', 'Fractura vertebral', 'MEDIA', 'PENDIENTE', '2024-04-08', NULL, NULL);