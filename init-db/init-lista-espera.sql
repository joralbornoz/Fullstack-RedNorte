USE db_lista_espera;

INSERT INTO registros_espera (rut_paciente, especialidad_destino, patologia_sospecha, prioridad, estado, fecha_ingreso, motivo_cancelacion, cancelado_por) VALUES
('77777777-7', 'Cardiologia', 'Arritmia cardiaca', 'ALTA', 'PENDIENTE', '2024-01-15', NULL, NULL),
('77777777-7', 'Neurologia', 'Migrania cronica', 'MEDIA', 'CONFIRMADO', '2024-03-20', NULL, NULL),
('88888888-8', 'Traumatologia', 'Fractura de cadera', 'ALTA', 'PENDIENTE', '2024-02-10', NULL, NULL),
('88888888-8', 'Cardiologia', 'Hipertension severa', 'ALTA', 'PENDIENTE', '2024-04-05', NULL, NULL),
('99999999-9', 'Gastroenterologia', 'Ulcera gastrica', 'MEDIA', 'PENDIENTE', '2024-02-28', NULL, NULL),
('99999999-9', 'Neurologia', 'Epilepsia', 'ALTA', 'PENDIENTE', '2024-01-30', NULL, NULL),
('10101010-1', 'Traumatologia', 'Lesion de rodilla', 'MEDIA', 'CONFIRMADO', '2024-03-12', NULL, NULL),
('10101010-1', 'Cardiologia', 'Soplo cardiaco', 'BAJA', 'PENDIENTE', '2024-05-01', NULL, NULL),
('12121212-1', 'Neurologia', 'Esclerosis multiple', 'ALTA', 'PENDIENTE', '2024-01-08', NULL, NULL),
('12121212-1', 'Gastroenterologia', 'Colon irritable', 'BAJA', 'PENDIENTE', '2024-04-18', NULL, NULL),
('13131313-3', 'Cardiologia', 'Insuficiencia cardiaca', 'ALTA', 'PENDIENTE', '2024-02-05', NULL, NULL),
('13131313-3', 'Traumatologia', 'Artritis severa', 'MEDIA', 'CANCELADO', '2024-03-01', 'Paciente no disponible', 'MEDICO'),
('14141414-4', 'Neurologia', 'Parkinson temprano', 'ALTA', 'PENDIENTE', '2024-01-20', NULL, NULL),
('14141414-4', 'Gastroenterologia', 'Hepatitis cronica', 'MEDIA', 'PENDIENTE', '2024-05-10', NULL, NULL),
('15151515-5', 'Traumatologia', 'Hernia discal', 'MEDIA', 'CONFIRMADO', '2024-03-25', NULL, NULL),
('15151515-5', 'Cardiologia', 'Taquicardia', 'ALTA', 'PENDIENTE', '2024-02-14', NULL, NULL),
('16161616-6', 'Neurologia', 'Accidente cerebrovascular', 'ALTA', 'PENDIENTE', '2024-01-05', NULL, NULL),
('16161616-6', 'Gastroenterologia', 'Pancreatitis', 'ALTA', 'PENDIENTE', '2024-02-22', NULL, NULL),
('17171717-7', 'Cardiologia', 'Angina de pecho', 'ALTA', 'PENDIENTE', '2024-01-12', NULL, NULL),
('17171717-7', 'Traumatologia', 'Fractura vertebral', 'MEDIA', 'PENDIENTE', '2024-04-08', NULL, NULL);