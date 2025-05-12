CREATE OR REPLACE VIEW view_maquinas_id_nome AS
SELECT id, name
FROM maquinas;


CREATE OR REPLACE VIEW view_estado_maquina AS
SELECT
    m.id AS MachineID,
    m.name AS MachineName,
    
    po.ID AS ProductionOrderID,
    po.OrderNumber,
    
    CASE 
        WHEN po.ID IS NULL THEN 'Sem Trabalho'
        ELSE 'Em Execução'
    END AS OrderStatus,
    
    pi.ID AS ProductionIndicatorID,
    
    -- Unidades produzidas
    pi.UnitsUnits, pi.TargetUnits,
    pi.UnitsBox10, pi.TargetBox10,
    pi.UnitsBox24, pi.TargetBox24,

    -- Estados das partes
    pi.StateMainLine, pi.StateBox10, pi.StateBox24,

    -- OEE Cápsulas
    pi.OeeUnits, pi.AvailabilityUnits, pi.PerformanceUnits, pi.QualityUnits,

    -- OEE Caixa10
    pi.OeeBox10, pi.AvailabilityBox10, pi.PerformanceBox10, pi.QualityBox10,

    -- OEE Caixa24
    pi.OeeBox24, pi.AvailabilityBox24, pi.PerformanceBox24, pi.QualityBox24

FROM maquinas m
LEFT JOIN ProductionOrders po ON po.MachineID = m.id 
    AND (NOW() BETWEEN po.dateStart AND IFNULL(po.dateEnd, NOW()))
LEFT JOIN ProductionIndicators pi ON pi.ProductionOrderID = po.ID;


CREATE OR REPLACE VIEW view_producao_por_hora_indicador AS
SELECT
    hp.ProductionIndicatorID,
    hp.MachinePart,
    hp.HourStart,
    hp.ProducedUnits
FROM HourlyProduction hp;

      
-- View para obter tipos de eventos (id e nome)
CREATE VIEW vw_event_types AS
SELECT id, name 
FROM event_types
ORDER BY display_order, id;