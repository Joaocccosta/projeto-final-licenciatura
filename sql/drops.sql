-- Eliminar tabelas na ordem inversa das dependências
DROP TABLE IF EXISTS HourlyProduction;
DROP TABLE IF EXISTS ProductionIndicators;
DROP TABLE IF EXISTS ProductionOrders;
DROP TABLE IF EXISTS EventDetails;
DROP TABLE IF EXISTS SystemSettings;
DROP TABLE IF EXISTS event_types;
DROP TABLE IF EXISTS maquinas;

-- Eliminar a base de dados
DROP DATABASE IF EXISTS producao_dashboard;