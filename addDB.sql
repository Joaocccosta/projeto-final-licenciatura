-- Table for Refresh Time Parametrization (assuming a single setting for simplicity)
CREATE TABLE RefreshValue (
    id INT PRIMARY KEY,
    value INT NOT NULL
);

-- Table for Event Types
CREATE TABLE EventTypes (
    type_name VARCHAR(100) PRIMARY KEY,
    type_description VARCHAR(255) NULL, -- Optional description of the event type
);

-- Table to Save Events, id of the line, type of event, timestamp, and comment optional. the primary key should be the id of the line and timestamp
CREATE TABLE Events (
    production_line_id NOT NULL , -- Unique identifier for each event
    event_type VARCHAR(100) NOT NULL, -- Foreign key to EventTypes table
    event_timestamp DATETIME NOT NULL, -- Timestamp of the event
    comment TEXT -- Optional comment about the event

    PRIMARY KEY (production_line_id, event_timestamp) -- Composite primary key
    FOREIGN KEY (event_type) REFERENCES EventTypes(type_name) -- Foreign key constraint to EventTypes table
);
