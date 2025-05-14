USE producao_dashboard;

# Maquinas
INSERT INTO maquinas (id, name, alt_name, description, notes, display_order) VALUES
(2, 'Rychiger 1', 'DeltaQ1', NULL, NULL, 1),
(3, 'Rychiger 2', 'DeltaQ2', NULL, NULL, 2),
(4, 'Rychiger 3', 'DeltaQ3', NULL, NULL, 3),
(5, 'Rychiger 4', 'DeltaQ4', NULL, NULL, 4),
(6, 'Rychiger 5', 'DeltaQ5', NULL, NULL, 5),
(7, 'Rychiger 6', 'DeltaQ6', NULL, NULL, 6),
(8, 'Bossar 1', NULL, NULL, NULL, 7),
(9, 'Bossar 2', NULL, NULL, NULL, 8),
(10, 'Bossar Descafeinados', NULL, NULL, NULL, 9),
(11, 'Goglio 1', NULL, NULL, NULL, 10),
(12, 'Goglio 2', NULL, NULL, NULL, 11),
(13, 'Goglio 4', NULL, NULL, NULL, 12),
(14, 'Goglio 5', NULL, NULL, NULL, 13),
(15, 'Goglio Cevadas', NULL, NULL, NULL, 14),
(16, 'GL 22', NULL, NULL, NULL, 15);


# Tipos de eventos
INSERT INTO event_types (id, name, alt_name, description, notes, display_order) VALUES
(2, 'Mudancas Fabrico', NULL, NULL, NULL, 2118),
(3, 'Avaria', NULL, NULL, NULL, 2123),
(4, 'Abastecimento Cafe', NULL, NULL, NULL, 2124),
(5, 'Manutencao', NULL, NULL, NULL, 2125),
(6, 'Subsidiarias', NULL, NULL, NULL, 2126),
(7, 'Afinacoes e Regulacoes', NULL, NULL, NULL, 2159),
(8, 'Limpezas e Manutencoes Op.', NULL, NULL, NULL, 2160),
(9, 'Problemas de Planeamento, Mercado ou Absentismo', NULL, NULL, NULL, 2167),
(10, 'Desperdicios', NULL, NULL, NULL, 2168),
(11, 'Outros Motivos', NULL, NULL, NULL, 2170),
(12, 'Sem Producao', NULL, NULL, NULL, 2241),
(13, 'Fora de Turno', NULL, NULL, NULL, 2481),
(15, 'Automatico', NULL, 'Automático', NULL, 5995),
(16, 'Manutencao', NULL, 'Manutenção', NULL, 6887);

# Sttings
INSERT INTO SystemSettings (SettingKey, SettingValue, Description)
VALUES ('refresh_interval_seconds', '120', 'Tempo de refresh automático em segundos');

INSERT INTO ProductionOrders (OrderNumber, dateStart, dateEnd, MachineID) VALUES
('ORD003', '2025-05-10 16:00:00', '2025-05-15 00:00:00', 3),
('ORD004', '2025-05-11 00:00:00', '2025-05-15 08:00:00', 4),
('ORD005', '2025-05-11 08:00:00', '2025-05-15 16:00:00', 9),
('ORD006', '2025-05-11 08:00:00', '2025-05-15 16:00:00', 10);

INSERT INTO ProductionIndicators (
    ProductionOrderID, MachineID,
    UnitsUnits, TargetUnits, UnitsBox10, TargetBox10, UnitsBox24, TargetBox24,
    StateMainLine, StateBox10, StateBox24,
    AvailabilityUnits, PerformanceUnits, QualityUnits, OeeUnits,
    AvailabilityBox10, PerformanceBox10, QualityBox10, OeeBox10,
    AvailabilityBox24, PerformanceBox24, QualityBox24, OeeBox24
) VALUES
(1, 3, 14000, 16000, 600, 700, 800, 900, 1, 1, 1, 94.0, 91.0, 97.0, 83.00, 93.0, 90.0, 96.0, 80.35, 92.0, 88.0, 95.0, 76.56),
(2, 4, 13000, 15000, 550, 650, 750, 850, 1, 1, 1, 93.0, 89.0, 96.0, 79.50, 92.0, 87.0, 94.0, 75.07, 91.0, 85.0, 93.0, 72.01),
(3, 9, 10000, 12000, NULL, NULL, NULL, NULL, 1, NULL, NULL, 90.0, 86.0, 93.0, 71.91, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 10, 11000, 13000, NULL, NULL, NULL, NULL, 1, NULL, NULL, 91.0, 87.0, 94.0, 74.39, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO EventDetails (
	StartDateTime, EndDateTime, SystemName, EventDefinitionName,
    EventCategoryID, DurationSeconds, State, IsActive, IsComplete, Comments
) VALUES
('2025-05-10 16:30:00', '2025-05-10 17:00:00', 'DeltaQ3', 'Abastecimento café', 4, 1800, 1, 0, 1, 'Recarregar reservatório de café'),
('2025-05-11 01:00:00', '2025-05-11 01:20:00', 'DeltaQ4', 'Ajuste de válvulas', 7, 1200, 1, 1, 1, 'Afinação por variação de pressão'),
('2025-05-11 09:00:00', NULL, 'Bossar 2', 'Falha na esteira', 3, NULL, 1, 1, 0, 'Avaria não resolvida ainda'),
('2025-05-11 10:00:00', '2025-05-11 10:15:00', 'Bossar 2', 'Limpeza rápida', 8, 900, 1, 1, 1, 'Limpeza corretiva de emergência');

INSERT INTO HourlyProduction (ProductionIndicatorID, MachinePart, HourStart, ProducedUnits) VALUES
-- ORD003 / DeltaQ3
(1, 'Capsules', '2025-05-10 16:00:00', 1600),
(1, 'Capsules', '2025-05-10 17:00:00', 1650),
(1, 'Capsules', '2025-05-10 18:00:00', 1850),
(1, 'Capsules', '2025-05-10 19:00:00', 2650),
(1, 'Capsules', '2025-05-10 20:00:00', 1350),
(1, 'Capsules', '2025-05-10 21:00:00', 1750),

(1, 'Box10', '2025-05-10 16:00:00', 65),
(1, 'Box24', '2025-05-10 16:00:00', 85),

-- ORD004 / DeltaQ4
(2, 'Capsules', '2025-05-11 00:00:00', 1550),
(2, 'Capsules', '2025-05-11 01:00:00', 1500),
(2, 'Box10', '2025-05-11 00:00:00', 60),
(2, 'Box24', '2025-05-11 00:00:00', 75),

-- ORD005 / Bossar 2
(3, 'Units', '2025-05-11 08:00:00', 1200),
(3, 'Units', '2025-05-11 09:00:00', 1250),

-- ORD006 / Bossar Descafeinados
(4, 'Units', '2025-05-11 08:00:00', 1300),
(4, 'Units', '2025-05-11 09:00:00', 1350);

INSERT INTO Users (
    ExternalID, Name, Description, Notes, UserTypeID, Type, Login, Email, 
    Locale, IsAdministrator, IsAuditor, Enabled, SiteID, PasswordHash, 
    AllowMultipleUserLogins, FailedLoginAttempts, PasswordUpdatedDateTime, Locked
) VALUES 
(NULL, 'João Costa - ISEL', 'Desenvolvedor de software', NULL, NULL, 3, 'jcosta.isel', 'jcosta@isel.pt', 
 'pt-PT', 1, 0, 1, 1, '$2a$12$q8AVCFJpLP8sqWGTb2EKGeKfFq2ZycJrLfG5hNK/grtYxS5V340wm', -- senha123 rounds=12
 0, 0, '2025-04-10 16:54:46.000', 0),

(NULL, 'Maria Silva', 'Engenheira de Produção', 'Responsável pela linha 1', NULL, 2, 'msilva', 'msilva@empresa.com', 
 'pt-PT', 0, 0, 1, 1, '$2a$12$q8AVCFJpLP8sqWGTb2EKGeKfFq2ZycJrLfG5hNK/grtYxS5V340wm', 
 0, 0, '2025-03-15 09:30:00.000', 0),

(NULL, 'Carlos Santos', 'Operador', 'Operador da linha 2', NULL, 1, 'csantos', 'csantos@empresa.com', 
 'pt-PT', 0, 0, 1, 1, '$2a$12$q8AVCFJpLP8sqWGTb2EKGeKfFq2ZycJrLfG5hNK/grtYxS5V340wm', 
 0, 0, '2025-02-20 14:15:22.000', 0),

(NULL, 'Ana Oliveira', 'Gerente de Qualidade', NULL, NULL, 2, 'aoliveira', 'aoliveira@empresa.com', 
 'pt-PT', 0, 1, 1, 1, '$2a$12$q8AVCFJpLP8sqWGTb2EKGeKfFq2ZycJrLfG5hNK/grtYxS5V340wm', 
 0, 0, '2025-01-05 10:45:30.000', 0),

(NULL, 'Pedro Ferreira', 'Administrador de Sistemas', 'IT Support', NULL, 3, 'pferreira', 'pferreira@empresa.com', 
 'pt-PT', 1, 0, 1, 1, '$2a$12$q8AVCFJpLP8sqWGTb2EKGeKfFq2ZycJrLfG5hNK/grtYxS5V340wm', 
 1, 0, '2025-04-01 08:20:15.000', 0);