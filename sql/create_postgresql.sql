-- PostgreSQL equivalent of the MySQL database structure

-- maquinas
CREATE TABLE maquinas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alt_name VARCHAR(100),
    description VARCHAR(255),
    notes TEXT,
    display_order INT
);

-- tipos eventos
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alt_name VARCHAR(100),
    description VARCHAR(255),
    notes TEXT,
    display_order INT
);

-- Eventos
CREATE TABLE EventDetails (
    EventID SERIAL PRIMARY KEY,
    StartDateTime TIMESTAMP, 
    EndDateTime TIMESTAMP NULL,
    SystemID INT,
    EventCategoryID INT,
    IsActive INT,
    IsComplete INT,
    Comments TEXT NULL,
    FOREIGN KEY (EventCategoryID) REFERENCES event_types(id),
    FOREIGN KEY (SystemID) REFERENCES maquinas(id)
);

-- Ordens
CREATE TABLE ProductionOrders (
    ID SERIAL PRIMARY KEY,
    OrderNumber VARCHAR(20) NOT NULL,
    dateStart TIMESTAMP,
    dateEnd TIMESTAMP,
    MachineID INT NOT NULL,
    FOREIGN KEY (MachineID) REFERENCES maquinas(id)
);

-- indicadores
CREATE TABLE ProductionIndicators (
    ID SERIAL PRIMARY KEY,
    
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
    StateMainLine SMALLINT NOT NULL DEFAULT 0,
    StateBox10 SMALLINT DEFAULT NULL,
    StateBox24 SMALLINT DEFAULT NULL,
	
    -- OEE por parte da máquina - Cápsulas
    AvailabilityUnits NUMERIC(5,2),
    PerformanceUnits NUMERIC(5,2),
    QualityUnits NUMERIC(5,2),
    OeeUnits NUMERIC(5,2),

    -- OEE por parte da máquina - Caixa10
    AvailabilityBox10 NUMERIC(5,2),
    PerformanceBox10 NUMERIC(5,2),
    QualityBox10 NUMERIC(5,2),
    OeeBox10 NUMERIC(5,2),

    -- OEE por parte da máquina - Caixa24
    AvailabilityBox24 NUMERIC(5,2),
    PerformanceBox24 NUMERIC(5,2),
    QualityBox24 NUMERIC(5,2),
    OeeBox24 NUMERIC(5,2),

    -- Foreign keys
    FOREIGN KEY (ProductionOrderID) REFERENCES ProductionOrders(ID),
    FOREIGN KEY (MachineID) REFERENCES maquinas(ID)
);

-- Produção por hora
CREATE TABLE HourlyProduction (
    ID SERIAL PRIMARY KEY,
    ProductionIndicatorID INT NOT NULL,
    MachinePart TEXT CHECK (MachinePart IN ('Units', 'Capsules', 'Box10', 'Box24')) NOT NULL,
    HourStart TIMESTAMP NOT NULL,
    ProducedUnits INT DEFAULT 0,

    FOREIGN KEY (ProductionIndicatorID) REFERENCES ProductionIndicators(ID)
);

-- System settings
CREATE TABLE SystemSettings (
    ID SERIAL PRIMARY KEY,
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    ExternalID VARCHAR(50),
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Notes TEXT,
    UserTypeID INT,
    Type INT,
    Login VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Locale VARCHAR(10),
    IsAdministrator BOOLEAN DEFAULT FALSE,
    IsAuditor BOOLEAN DEFAULT FALSE,
    Enabled BOOLEAN DEFAULT TRUE,
    ModifiedDateTime TIMESTAMP,
    UploadedDateTime TIMESTAMP,
    AltName VARCHAR(100),
    SiteID INT,
    PasswordHash VARCHAR(255) NOT NULL,
    AllowMultipleUserLogins BOOLEAN DEFAULT FALSE,
    FailedLoginAttempts INT DEFAULT 0,
    PasswordUpdatedDateTime TIMESTAMP,
    PasswordHistory TEXT,
    Locked BOOLEAN DEFAULT FALSE
);