const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

/**
 * Função para buscar informações detalhadas sobre a máquina e seus indicadores OEE
 * @param {number} lineId - ID da linha/máquina
 * @returns {Promise<Object>} - Objeto com informações da máquina e seus indicadores
 */
async function getOEEValues(lineId) {
  try {
    // Buscar informações da máquina da view_estado_maquina
    const machineResult = await db.query(
      'SELECT * FROM "view_estado_maquina" WHERE "MachineID" = $1',
      [lineId]
    );

    if (machineResult.rows.length === 0) {
      throw new Error(`Máquina com ID ${lineId} não encontrada`);
    }

    const machineData = machineResult.rows[0];
    
    // Buscar dados de produção por hora, se houver um indicador de produção
    let hourlyProduction = [];
    if (machineData.ProductionIndicatorID) {
      const hourlyResult = await db.query(
        'SELECT * FROM "view_producao_por_hora_indicador" WHERE "ProductionIndicatorID" = $1 ORDER BY "HourStart"',
        [machineData.ProductionIndicatorID]
      );
      
      hourlyProduction = hourlyResult.rows;
    }

    // Construir objeto de resultado com todos os dados necessários
    const result = {
      machine: {
        id: machineData.MachineID,
        name: machineData.MachineName
      },
      order: {
        id: machineData.ProductionOrderID,
        orderNumber: machineData.OrderNumber,
        status: machineData.OrderStatus
      },
      production: {},
      oee: {},
      hourlyProduction: hourlyProduction.map(item => ({
        part: item.MachinePart,
        hourStart: item.HourStart,
        units: item.ProducedUnits
      }))
    };

    // Verificar se é uma máquina de unidades ou de cápsulas+caixas
    if (machineData.StateBox10 === null && machineData.StateBox24 === null) {
      // Máquina de unidades simples
      result.production.units = {
        current: machineData.UnitsUnits || 0,
        target: machineData.TargetUnits || 0,
        state: machineData.StateMainLine
      };
      
      result.oee.units = {
        total: machineData.OeeUnits || 0,
        availability: machineData.AvailabilityUnits || 0,
        performance: machineData.PerformanceUnits || 0,
        quality: machineData.QualityUnits || 0
      };
    } else {
      // Máquina de cápsulas + caixas
      result.production.capsules = {
        current: machineData.UnitsUnits || 0, // Usando UnitsUnits para cápsulas
        target: machineData.TargetUnits || 0, // Usando TargetUnits para cápsulas
        state: machineData.StateMainLine
      };
      
      result.oee.capsules = {
        total: machineData.OeeUnits || 0, // Usando OeeUnits para cápsulas
        availability: machineData.AvailabilityUnits || 0, // Usando AvailabilityUnits para cápsulas
        performance: machineData.PerformanceUnits || 0, // Usando PerformanceUnits para cápsulas
        quality: machineData.QualityUnits || 0 // Usando QualityUnits para cápsulas
      };
      
      // Adicionar Box10 se existir
      if (machineData.StateBox10 !== null) {
        result.production.box10 = {
          current: machineData.UnitsBox10 || 0,
          target: machineData.TargetBox10 || 0,
          state: machineData.StateBox10
        };
        
        result.oee.box10 = {
          total: machineData.OeeBox10 || 0,
          availability: machineData.AvailabilityBox10 || 0,
          performance: machineData.PerformanceBox10 || 0,
          quality: machineData.QualityBox10 || 0
        };
      }
      
      // Adicionar Box24 se existir
      if (machineData.StateBox24 !== null) {
        result.production.box24 = {
          current: machineData.UnitsBox24 || 0,
          target: machineData.TargetBox24 || 0,
          state: machineData.StateBox24
        };
        
        result.oee.box24 = {
          total: machineData.OeeBox24 || 0,
          availability: machineData.AvailabilityBox24 || 0,
          performance: machineData.PerformanceBox24 || 0,
          quality: machineData.QualityBox24 || 0
        };
      }
    }

    return result;
  } catch (error) {
    console.error(`Erro ao buscar OEE para linha ${lineId}:`, error);
    throw error;
  }
}

/**
 * Rota para obter os valores de OEE para uma linha específica
 */
router.get('/:lineId', async (req, res) => {
  const { lineId } = req.params;
  
  if (!lineId || isNaN(parseInt(lineId))) {
    return res.status(400).json({
      success: false,
      message: 'ID da linha inválido'
    });
  }
  
  try {
    const oeeData = await getOEEValues(parseInt(lineId));
    res.json({
      success: true,
      data: oeeData
    });
  } catch (error) {
    console.error('Erro ao buscar valores de OEE:', error);
    res.status(error.message.includes('não encontrada') ? 404 : 500).json({
      success: false,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;