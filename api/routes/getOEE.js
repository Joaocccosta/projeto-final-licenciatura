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
    // Buscar informações da máquina da view_machine_state
    const machineResult = await db.query(
      'SELECT * FROM "view_machine_state" WHERE "machineid" = $1',
      [lineId]
    );
  

    if (machineResult.rows.length === 0) {
      throw new Error(`Máquina com ID ${lineId} não encontrada`);
    }

    const machineData = machineResult.rows[0];
    
    // Buscar dados de produção por hora, se houver um indicador de produção
    let hourlyProduction = [];
    if (machineData.productionindicatorid) {
      const hourlyResult = await db.query(
        'SELECT * FROM "view_hourly_production" WHERE "productionindicatorid" = $1 ORDER BY "hourstart"',
        [machineData.productionindicatorid]
      );
      
      hourlyProduction = hourlyResult.rows;
    }

    // Construir objeto de resultado com todos os dados necessários
    const result = {
      machine: {
        id: machineData.machineid,
        name: machineData.machinename
      },
      order: {
        id: machineData.productionorderid,
        orderNumber: machineData.ordernumber,
        status: machineData.orderstatus
      },
      production: {},
      oee: {},
      hourlyProduction: hourlyProduction.map(item => ({
        part: item.machinepart,
        hourStart: item.hourstart,
        units: item.producedunits
      }))
    };

    // Verificar se é uma máquina de unidades ou de cápsulas+caixas
    if (machineData.statebox10 === null && machineData.statebox24 === null) {
      // Máquina de unidades simples
      result.production.units = {
        current: machineData.unitsunits || 0,
        target: machineData.targetunits || 0,
        state: machineData.statemainline
      };

      result.oee.units = {
        total: parseFloat(machineData.oeeunits) || 0,
        availability: parseFloat(machineData.availabilityunits) || 0,
        performance: parseFloat(machineData.performanceunits) || 0,
        quality: parseFloat(machineData.qualityunits) || 0
      };
    } else {
      // Máquina de cápsulas + caixas
      result.production.capsules = {
        current: machineData.unitsunits || 0,
        target: machineData.targetunits || 0,
        state: machineData.statemainline
      };

      result.oee.capsules = {
        total: parseFloat(machineData.oeeunits) || 0,
        availability: parseFloat(machineData.availabilityunits) || 0,
        performance: parseFloat(machineData.performanceunits) || 0,
        quality: parseFloat(machineData.qualityunits) || 0
      };

      // Adicionar Box10 se existir
      if (machineData.statebox10 !== null) {
        result.production.box10 = {
          current: machineData.unitsbox10 || 0,
          target: machineData.targetbox10 || 0,
          state: machineData.statebox10
        };

        result.oee.box10 = {
          total: parseFloat(machineData.oeebox10) || 0,
          availability: parseFloat(machineData.availabilitybox10) || 0,
          performance: parseFloat(machineData.performancebox10) || 0,
          quality: parseFloat(machineData.qualitybox10) || 0
        };
      }
      
      // Adicionar Box24 se existir
      if (machineData.statebox24 !== null) {
        result.production.box24 = {
          current: machineData.unitsbox24 || 0,
          target: machineData.targetbox24 || 0,
          state: machineData.statebox24
        };

        result.oee.box24 = {
          total: parseFloat(machineData.oeebox24) || 0,
          availability: parseFloat(machineData.availabilitybox24) || 0,
          performance: parseFloat(machineData.performancebox24) || 0,
          quality: parseFloat(machineData.qualitybox24) || 0
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