USE producao_dashboard;

# Maquinas
INSERT INTO maquinas (name, alt_name, description, notes, display_order) VALUES
('Rychiger 1', 'DeltaQ1', NULL, NULL, 1),
('Rychiger 2', 'DeltaQ2', NULL, NULL, 2),
('Rychiger 3', 'DeltaQ3', NULL, NULL, 3),
('Rychiger 4', 'DeltaQ4', NULL, NULL, 4),
('Rychiger 5', 'DeltaQ5', NULL, NULL, 5),
('Rychiger 6', 'DeltaQ6', NULL, NULL, 6),
('Bossar 1', NULL, NULL, NULL, 7),
('Bossar 2', NULL, NULL, NULL, 8),
('Bossar Descafeinados', NULL, NULL, NULL, 9),
('Goglio 1', NULL, NULL, NULL, 10),
('Goglio 2', NULL, NULL, NULL, 11),
('Goglio 4', NULL, NULL, NULL, 12),
('Goglio 5', NULL, NULL, NULL, 13),
('Goglio Cevadas', NULL, NULL, NULL, 14),
('GL 22', NULL, NULL, NULL, 15);


# Tipos de eventos
INSERT INTO event_types (name, alt_name, description, notes, display_order) VALUES
('Mudancas Fabrico', NULL, NULL, NULL, 2118),
('Avaria', NULL, NULL, NULL, 2123),
('Abastecimento Cafe', NULL, NULL, NULL, 2124),
('Manutencao', NULL, NULL, NULL, 2125),
('Subsidiarias', NULL, NULL, NULL, 2126),
('Afinacoes e Regulacoes', NULL, NULL, NULL, 2159),
('Limpezas e Manutencoes Op.', NULL, NULL, NULL, 2160),
('Problemas de Planeamento, Mercado ou Absentismo', NULL, NULL, NULL, 2167),
('Desperdicios', NULL, NULL, NULL, 2168),
('Outros Motivos', NULL, NULL, NULL, 2170),
('Sem Producao', NULL, NULL, NULL, 2241),
('Fora de Turno', NULL, NULL, NULL, 2481),
('Automatico', NULL, 'Automático', NULL, 5995),
('Manutencao', NULL, 'Manutenção', NULL, 6887);

# Settings
INSERT INTO SystemSettings (SettingKey, SettingValue, Description)
VALUES ('refresh_interval_seconds', '120', 'Tempo de refresh automático em segundos');

INSERT INTO ProductionOrders (OrderNumber, dateStart, dateEnd, MachineID) VALUES
('ORD003', '2025-05-10 16:00:00', '2025-05-15 00:00:00', 2),
('ORD004', '2025-05-11 00:00:00', '2025-05-15 08:00:00', 3),
('ORD005', '2025-05-11 08:00:00', '2025-05-15 16:00:00', 8),
('ORD006', '2025-05-11 08:00:00', '2025-05-15 16:00:00', 9);

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
	StartDateTime, EndDateTime, SystemID,
    EventCategoryID, IsActive, IsComplete, Comments
) VALUES
('2025-05-10 16:30:00', '2025-05-10 17:00:00', 3, 3, 0, 1, 'Recarregar reservatório de café'),
('2025-05-11 01:00:00', '2025-05-11 01:20:00', 4, 6, 1, 1, 'Afinação por variação de pressão');

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


 -- novos inserts
 -- Additional Production Orders (some today, some next week, some with longer intervals)
INSERT INTO ProductionOrders (OrderNumber, dateStart, dateEnd, MachineID) VALUES
-- Today's orders
('ORD007', '2025-05-16 08:00:00', '2025-05-17 08:00:00', 1),
('ORD008', '2025-05-16 08:00:00', '2025-05-17 08:00:00', 4),
('ORD009', '2025-05-16 16:00:00', '2025-05-18 00:00:00', 5),

-- Weekend orders
('ORD010', '2025-05-17 08:00:00', '2025-05-19 08:00:00', 6),
('ORD011', '2025-05-18 00:00:00', '2025-05-20 00:00:00', 7),

-- Next week orders
('ORD012', '2025-05-19 08:00:00', '2025-05-22 08:00:00', 10),
('ORD013', '2025-05-20 08:00:00', '2025-05-23 16:00:00', 11),
('ORD014', '2025-05-21 00:00:00', '2025-05-24 00:00:00', 12),

-- Orders with longer intervals
('ORD015', '2025-05-23 08:00:00', '2025-05-30 16:00:00', 13),
('ORD016', '2025-05-26 08:00:00', '2025-06-02 16:00:00', 14);

-- Additional Production Indicators
INSERT INTO ProductionIndicators (
    ProductionOrderID, MachineID,
    UnitsUnits, TargetUnits, UnitsBox10, TargetBox10, UnitsBox24, TargetBox24,
    StateMainLine, StateBox10, StateBox24,
    AvailabilityUnits, PerformanceUnits, QualityUnits, OeeUnits,
    AvailabilityBox10, PerformanceBox10, QualityBox10, OeeBox10,
    AvailabilityBox24, PerformanceBox24, QualityBox24, OeeBox24
) VALUES
-- Today's production (different states)
(5, 2, 5200, 16000, 520, 1600, 210, 650, 1, 1, 1, 95.5, 92.3, 98.1, 86.44, 94.2, 91.5, 97.5, 84.20, 93.8, 90.7, 97.0, 82.68),
(6, 5, 4800, 15000, 480, 1500, 195, 600, 1, 0, 1, 94.0, 88.5, 97.8, 81.40, 0.0, 0.0, 0.0, 0.0, 92.5, 87.3, 96.2, 77.66),
(7, 6, 3200, 12000, 0, 0, 0, 0, 0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),

-- Weekend production
(8, 7, 9500, 10000, 950, 1000, 390, 420, 1, 1, 1, 96.5, 94.8, 99.0, 90.55, 96.0, 94.2, 98.5, 89.14, 95.5, 93.0, 98.0, 87.07),
(9, 8, 8800, 12000, 0, 0, 0, 0, 1, 0, 0, 92.0, 87.5, 96.5, 77.60, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),

-- Next week production
(10, 11, 11000, 12000, 1100, 1200, 450, 500, 1, 1, 1, 97.0, 95.0, 99.2, 91.36, 96.5, 94.5, 98.8, 90.16, 96.0, 93.5, 98.5, 88.43),
(11, 12, 13500, 15000, 1350, 1500, 560, 630, 1, 1, 1, 98.0, 96.2, 99.5, 93.84, 97.5, 95.8, 99.0, 92.53, 97.0, 95.0, 98.8, 91.02),
(12, 13, 9800, 10000, 970, 1000, 400, 425, 1, 1, 1, 97.5, 95.5, 99.3, 92.51, 97.0, 95.0, 99.0, 91.27, 96.5, 94.5, 98.8, 90.16),

-- Orders with longer intervals
(13, 14, 25000, 30000, 2500, 3000, 1040, 1250, 1, 1, 1, 96.0, 93.5, 98.5, 88.51, 95.5, 93.0, 98.0, 87.12, 95.0, 92.5, 97.5, 85.74),
(14, 15, 45000, 50000, 4500, 5000, 1880, 2100, 1, 1, 1, 97.8, 96.0, 99.5, 93.45, 97.2, 95.5, 99.2, 92.17, 96.8, 95.0, 99.0, 91.05);

-- Additional Hourly Production data
INSERT INTO HourlyProduction (ProductionIndicatorID, MachinePart, HourStart, ProducedUnits) VALUES
-- Today's hourly production (ORD007 / DeltaQ1)
(5, 'Capsules', '2025-05-16 08:00:00', 850),
(5, 'Capsules', '2025-05-16 09:00:00', 920),
(5, 'Capsules', '2025-05-16 10:00:00', 880),
(5, 'Capsules', '2025-05-16 11:00:00', 910),
(5, 'Capsules', '2025-05-16 12:00:00', 780),
(5, 'Capsules', '2025-05-16 13:00:00', 860),
(5, 'Box10', '2025-05-16 08:00:00', 85),
(5, 'Box10', '2025-05-16 09:00:00', 92),
(5, 'Box10', '2025-05-16 10:00:00', 88),
(5, 'Box24', '2025-05-16 08:00:00', 35),
(5, 'Box24', '2025-05-16 09:00:00', 38),
(5, 'Box24', '2025-05-16 10:00:00', 36),

-- Today's hourly production (ORD008 / DeltaQ5)
(6, 'Capsules', '2025-05-16 08:00:00', 820),
(6, 'Capsules', '2025-05-16 09:00:00', 840),
(6, 'Capsules', '2025-05-16 10:00:00', 790),
(6, 'Capsules', '2025-05-16 11:00:00', 760),
(6, 'Capsules', '2025-05-16 12:00:00', 800),
(6, 'Capsules', '2025-05-16 13:00:00', 790),
(6, 'Box24', '2025-05-16 08:00:00', 33),
(6, 'Box24', '2025-05-16 09:00:00', 35),
(6, 'Box24', '2025-05-16 10:00:00', 32),

-- Weekend hourly production (ORD010 / Rychiger 6)
(8, 'Capsules', '2025-05-17 08:00:00', 1100),
(8, 'Capsules', '2025-05-17 09:00:00', 1150),
(8, 'Capsules', '2025-05-17 10:00:00', 1200),
(8, 'Capsules', '2025-05-17 11:00:00', 1050),
(8, 'Capsules', '2025-05-17 12:00:00', 1000),
(8, 'Capsules', '2025-05-17 13:00:00', 1150),
(8, 'Capsules', '2025-05-17 14:00:00', 1250),
(8, 'Capsules', '2025-05-17 15:00:00', 1300),
(8, 'Capsules', '2025-05-17 16:00:00', 1300),
(8, 'Box10', '2025-05-17 08:00:00', 110),
(8, 'Box10', '2025-05-17 09:00:00', 115),
(8, 'Box10', '2025-05-17 10:00:00', 120),
(8, 'Box24', '2025-05-17 08:00:00', 45),
(8, 'Box24', '2025-05-17 09:00:00', 48),
(8, 'Box24', '2025-05-17 10:00:00', 50),

-- Next week production with high output (ORD012 / Goglio 1)
(10, 'Capsules', '2025-05-19 08:00:00', 950),
(10, 'Capsules', '2025-05-19 09:00:00', 980),
(10, 'Capsules', '2025-05-19 10:00:00', 1020),
(10, 'Capsules', '2025-05-19 11:00:00', 950),
(10, 'Capsules', '2025-05-19 12:00:00', 900),
(10, 'Capsules', '2025-05-19 13:00:00', 950),
(10, 'Capsules', '2025-05-19 14:00:00', 980),
(10, 'Capsules', '2025-05-19 15:00:00', 1000),
(10, 'Capsules', '2025-05-19 16:00:00', 1050),
(10, 'Capsules', '2025-05-19 17:00:00', 1100),
(10, 'Capsules', '2025-05-19 18:00:00', 1120),
(10, 'Box10', '2025-05-19 08:00:00', 95),
(10, 'Box10', '2025-05-19 09:00:00', 98),
(10, 'Box10', '2025-05-19 10:00:00', 102),
(10, 'Box24', '2025-05-19 08:00:00', 39),
(10, 'Box24', '2025-05-19 09:00:00', 40),
(10, 'Box24', '2025-05-19 10:00:00', 42),

-- Production with varied output (ORD013 / Goglio 2)
(11, 'Capsules', '2025-05-20 08:00:00', 1200),
(11, 'Capsules', '2025-05-20 09:00:00', 1250),
(11, 'Capsules', '2025-05-20 10:00:00', 1100),
(11, 'Capsules', '2025-05-20 11:00:00', 950),
(11, 'Capsules', '2025-05-20 12:00:00', 900),
(11, 'Capsules', '2025-05-20 13:00:00', 1000),
(11, 'Capsules', '2025-05-20 14:00:00', 1150),
(11, 'Capsules', '2025-05-20 15:00:00', 1300),
(11, 'Capsules', '2025-05-20 16:00:00', 1400),
(11, 'Capsules', '2025-05-20 17:00:00', 1350),
(11, 'Capsules', '2025-05-20 18:00:00', 1200),
(11, 'Capsules', '2025-05-20 19:00:00', 1100),
(11, 'Capsules', '2025-05-20 20:00:00', 950),
(11, 'Box10', '2025-05-20 08:00:00', 120),
(11, 'Box10', '2025-05-20 09:00:00', 125),
(11, 'Box10', '2025-05-20 10:00:00', 110),
(11, 'Box24', '2025-05-20 08:00:00', 50),
(11, 'Box24', '2025-05-20 09:00:00', 52),
(11, 'Box24', '2025-05-20 10:00:00', 46),

-- Long-running order with spread out data (ORD015 / Goglio 4)
(13, 'Capsules', '2025-05-23 08:00:00', 1050),
(13, 'Capsules', '2025-05-23 12:00:00', 1100),
(13, 'Capsules', '2025-05-23 16:00:00', 1150),
(13, 'Capsules', '2025-05-24 08:00:00', 1200),
(13, 'Capsules', '2025-05-24 16:00:00', 1250),
(13, 'Capsules', '2025-05-25 08:00:00', 1050),
(13, 'Capsules', '2025-05-25 16:00:00', 1100),
(13, 'Capsules', '2025-05-26 08:00:00', 1200),
(13, 'Capsules', '2025-05-26 16:00:00', 1300),
(13, 'Capsules', '2025-05-27 08:00:00', 1250),
(13, 'Capsules', '2025-05-27 16:00:00', 1200),
(13, 'Capsules', '2025-05-28 08:00:00', 1150),
(13, 'Capsules', '2025-05-28 16:00:00', 1100),
(13, 'Capsules', '2025-05-29 08:00:00', 1300),
(13, 'Capsules', '2025-05-29 16:00:00', 1350),
(13, 'Box10', '2025-05-23 08:00:00', 105),
(13, 'Box10', '2025-05-24 08:00:00', 120),
(13, 'Box10', '2025-05-25 08:00:00', 105),
(13, 'Box10', '2025-05-26 08:00:00', 120),
(13, 'Box10', '2025-05-27 08:00:00', 125),
(13, 'Box10', '2025-05-28 08:00:00', 115),
(13, 'Box10', '2025-05-29 08:00:00', 130),
(13, 'Box24', '2025-05-23 08:00:00', 43),
(13, 'Box24', '2025-05-25 08:00:00', 42),
(13, 'Box24', '2025-05-27 08:00:00', 50),
(13, 'Box24', '2025-05-29 08:00:00', 54);


-- Eventos não finalizados para teste
INSERT INTO EventDetails (
    StartDateTime, EndDateTime, SystemID,
    EventCategoryID, IsActive, IsComplete, Comments
) VALUES
-- Eventos em andamento (não finalizados)
('2025-05-15 09:30:00', NULL, 1, 2, 1, 0, 'Manutenção preventiva pendente'),
('2025-05-15 14:45:00', NULL, 2, 4, 1, 0, 'Calibração necessária'),
('2025-05-16 08:15:00', NULL, 3, 1, 1, 0, 'Limpeza do sistema'),
('2025-05-16 11:20:00', NULL, 1, 5, 1, 0, 'Substituição de peça'),
('2025-05-16 13:00:00', NULL, 4, 3, 1, 0, 'Verificação de temperatura');