-- Table for Refresh Time Parametrization (assuming a single setting for simplicity)
CREATE TABLE RefreshSettings (
    refresh_interval INT PRIMARY KEY -- Interval in seconds
);

-- Table for Event Types
CREATE TABLE EventTypes (
    type_name VARCHAR(100) PRIMARY KEY,
    type_description VARCHAR(255) NULL, -- Optional description of the event type
);

-- Table to Save Events, id of the line, type of event, timestamp, and comment optional. the primary key should be the id of the line and timestamp
CREATE TABLE Events (
    production_line_id REFERENCES ..., -- Unique identifier for each event
    event_type VARCHAR(100) REFERENCES EventTypes(type_name), -- Foreign key to EventTypes table
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the event
    comment VARCHAR(255) NULL -- Optional comment about the event

    PRIMARY KEY (production_line_id, event_timestamp) -- Composite primary key
);
