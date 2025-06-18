-- PostgreSQL equivalent of the MySQL database structure

-- maquinas
-- SQLINES FOR EVALUATION USE ONLY (14 DAYS)
CREATE TABLE maquinas (
    id INT PRIMARY KEY generated always as identity,
    name VARCHAR(100) NOT NULL,
    alt_name VARCHAR(100),
    description VARCHAR(255),
    notes TEXT,
    display_order INT
);

-- tipos eventos
CREATE TABLE event_types (
  id INT PRIMARY KEY generated always as identity,
  name VARCHAR(100) NOT NULL,
  alt_name VARCHAR(100),
  description VARCHAR(255),
  notes TEXT,
  display_order INT
);

-- Eventos
CREATE TABLE EventDetails (
    EventID INT PRIMARY KEY generated always as identity,
    StartDateTime TIMESTAMP(0), 
    EndDateTime TIMESTAMP(0) NULL,
    SystemID INT,
    EventCategoryID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    IsComplete BOOLEAN DEFAULT FALSE,
    Comments TEXT NULL,
    FOREIGN KEY (EventCategoryID) REFERENCES event_types(id),
    FOREIGN KEY (SystemID) REFERENCES maquinas(id)
);

-- Ordens
CREATE TABLE ProductionOrders (
    ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    OrderNumber VARCHAR(20) NOT NULL,
    dateStart TIMESTAMP(0),
    dateEnd TIMESTAMP(0),
    MachineID INT NOT NULL,
    FOREIGN KEY (MachineID) REFERENCES maquinas(id)
);

--indicadores
CREATE TABLE ProductionIndicators (
    ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    ProductionOrderID INT NOT NULL,
    MachineID INT NOT NULL,

    -- SQLINES DEMO *** as (atuais e alvo)
    UnitsUnits INT,
    TargetUnits INT,
    UnitsBox10 INT,
    TargetBox10 INT,
    UnitsBox24 INT,
    TargetBox24 INT,

    -- SQLINES DEMO ***  da máquina (0 = parado, 1 = ativo)
    StateMainLine SMALLINT NOT NULL DEFAULT 0,
    StateBox10 SMALLINT DEFAULT NULL,
    StateBox24 SMALLINT DEFAULT NULL,
	
    -- SQLINES DEMO *** máquina - Cápsulas
    AvailabilityUnits DECIMAL(5,2),
    PerformanceUnits DECIMAL(5,2),
    QualityUnits DECIMAL(5,2),
    OeeUnits DECIMAL(5,2),

    -- SQLINES DEMO *** máquina - Caixa10
    AvailabilityBox10 DECIMAL(5,2),
    PerformanceBox10 DECIMAL(5,2),
    QualityBox10 DECIMAL(5,2),
    OeeBox10 DECIMAL(5,2),

    -- SQLINES DEMO *** máquina - Caixa24
    AvailabilityBox24 DECIMAL(5,2),
    PerformanceBox24 DECIMAL(5,2),
    QualityBox24 DECIMAL(5,2),
    OeeBox24 DECIMAL(5,2),

    -- Fo... SQLINES DEMO ***
    FOREIGN KEY (ProductionOrderID) REFERENCES ProductionOrders(ID),
    FOREIGN KEY (MachineID) REFERENCES maquinas(ID)
);


--Produção por hora
CREATE TABLE HourlyProduction (
    ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ProductionIndicatorID INT NOT NULL,
    MachinePart VARCHAR(30) CHECK (MACHINEPART IN ('Units', 'Capsules', 'Box10', 'Box24')) NOT NULL,
    HourStart TIMESTAMP(0) NOT NULL,
    ProducedUnits INT DEFAULT 0,

    FOREIGN KEY (ProductionIndicatorID) REFERENCES ProductionIndicators(ID)
);

CREATE TABLE SystemSettings (
    ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    LastUpdated TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP /* ON UPDATE CURRENT_TIMESTAMP */
);

CREATE TABLE Users (
    ID INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ExternalID VARCHAR(50),
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Notes TEXT,
    UserTypeID INTEGER,
    Type INTEGER,
    Login VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Locale VARCHAR(10),
    IsAdministrator BOOLEAN DEFAULT FALSE,
    IsAuditor BOOLEAN DEFAULT FALSE,
    Enabled BOOLEAN DEFAULT TRUE,
    ModifiedDateTime TIMESTAMP(0),
    UploadedDateTime TIMESTAMP(0),
    AltName VARCHAR(100),
    SiteID INTEGER,
    PasswordHash VARCHAR(255) NOT NULL,
    AllowMultipleUserLogins BOOLEAN DEFAULT FALSE,
    FailedLoginAttempts INTEGER DEFAULT 0,
    PasswordUpdatedDateTime TIMESTAMP(0),
    PasswordHistory TEXT,
    Locked BOOLEAN DEFAULT FALSE
);