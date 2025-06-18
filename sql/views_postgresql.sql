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
    AND (CURRENT_TIMESTAMP BETWEEN po.dateStart AND COALESCE(po.dateEnd, CURRENT_TIMESTAMP))
LEFT JOIN ProductionIndicators pi ON pi.ProductionOrderID = po.ID;

CREATE OR REPLACE VIEW view_producao_por_hora_indicador AS
SELECT
    hp.productionindicatorid,
    hp.machinepart,
    hp.hourstart,
    hp.producedunits
FROM hourlyproduction hp
WHERE hp.hourstart >= NOW() - INTERVAL '8 hours'
  AND hp.hourstart < NOW();

      
-- View para obter tipos de eventos (id e nome)
CREATE VIEW view_event_types AS
SELECT id, name 
FROM event_types
ORDER BY display_order, id;


CREATE OR REPLACE VIEW view_unfinished_events AS
SELECT 
    ed.EventID, 
    et.name AS task_name,
    ed.StartDateTime  -- Adicionado o campo de data/hora de início
FROM 
    EventDetails ed
INNER JOIN 
    event_types et ON ed.EventCategoryID = et.id
WHERE 
    ed.IsComplete = FALSE
ORDER BY 
    ed.StartDateTime DESC;