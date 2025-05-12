CREATE DATABASE IF NOT EXISTS producao_dashboard;
USE producao_dashboard;

# maquinas
CREATE TABLE maquinas (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alt_name VARCHAR(100),
    description VARCHAR(255),
    notes TEXT,
    display_order INT
);

# tipos eventos
CREATE TABLE event_types (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  alt_name VARCHAR(100),
  description VARCHAR(255),
  notes TEXT,
  display_order INT
);

# Eventos
CREATE TABLE EventDetails (
    EventID INT PRIMARY KEY auto_increment,
    StartDateTime DATETIME, 
    EndDateTime DATETIME NULL,
    SystemName VARCHAR(255),
    EventDefinitionName VARCHAR(255),
    EventCategoryID INT,
    DurationSeconds INT,
    State INT,
    IsActive INT,
    IsComplete INT,
    Comments TEXT NULL,
    FOREIGN KEY (EventCategoryID) REFERENCES event_types(id)
);

# Ordens
CREATE TABLE ProductionOrders (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    OrderNumber VARCHAR(20) NOT NULL,
    dateStart DATETIME,
    dateEnd DATETIME,
    MachineID INT NOT NULL,
    FOREIGN KEY (MachineID) REFERENCES maquinas(id)
);

#indicadores
CREATE TABLE ProductionIndicators (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    
    ProductionOrderID INT NOT NULL,
    MachineID INT NOT NULL,

    -- Unidades produzidas (atuais e alvo)
    UnitsUnits INT,
    TargetUnits INT,
    UnitsBox10 INT,
    TargetBox10 INT,
    UnitsBox24 INT,
    TargetBox24 INT,

    -- Estado das partes da máquina (0 = parado, 1 = ativo)
    StateMainLine TINYINT NOT NULL DEFAULT 0,
    StateBox10 TINYINT DEFAULT NULL,
    StateBox24 TINYINT DEFAULT NULL,
	
    -- OEE por parte da máquina - Cápsulas
    AvailabilityUnits DECIMAL(5,2),
    PerformanceUnits DECIMAL(5,2),
    QualityUnits DECIMAL(5,2),
    OeeUnits DECIMAL(5,2),

    -- OEE por parte da máquina - Caixa10
    AvailabilityBox10 DECIMAL(5,2),
    PerformanceBox10 DECIMAL(5,2),
    QualityBox10 DECIMAL(5,2),
    OeeBox10 DECIMAL(5,2),

    -- OEE por parte da máquina - Caixa24
    AvailabilityBox24 DECIMAL(5,2),
    PerformanceBox24 DECIMAL(5,2),
    QualityBox24 DECIMAL(5,2),
    OeeBox24 DECIMAL(5,2),

    -- Foreign keys
    FOREIGN KEY (ProductionOrderID) REFERENCES ProductionOrders(ID),
    FOREIGN KEY (MachineID) REFERENCES maquinas(ID)
);


#Produção por hora
CREATE TABLE HourlyProduction (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ProductionIndicatorID INT NOT NULL,
    MachinePart ENUM('Units', 'Capsules', 'Box10', 'Box24') NOT NULL,
    HourStart DATETIME NOT NULL,
    ProducedUnits INT DEFAULT 0,

    FOREIGN KEY (ProductionIndicatorID) REFERENCES ProductionIndicators(ID)
);

CREATE TABLE SystemSettings (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

