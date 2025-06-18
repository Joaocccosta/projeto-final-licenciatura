-- Função para enviar notificações
CREATE OR REPLACE FUNCTION notify_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('dashboard_updates', TG_TABLE_NAME); -- Apenas envia o nome da tabela
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para a tabela ProductionIndicators
CREATE TRIGGER production_indicators_trigger
AFTER INSERT OR UPDATE OR DELETE
ON ProductionIndicators
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

-- Trigger para a tabela HourlyProduction
CREATE TRIGGER hourly_production_trigger
AFTER INSERT OR UPDATE OR DELETE
ON HourlyProduction
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

-- Trigger para a tabela EventDetails
CREATE TRIGGER event_details_trigger
AFTER INSERT OR UPDATE OR DELETE
ON EventDetails
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

-- Trigger para a tabela ProductionOrders
CREATE TRIGGER production_orders_trigger
AFTER INSERT OR UPDATE OR DELETE
ON ProductionOrders
FOR EACH ROW
EXECUTE FUNCTION notify_changes();