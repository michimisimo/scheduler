const axios = require('axios');
const momentTimezone = require('moment-timezone');

// Constantes
const SCHEDULE_INTERVAL = 60000;  // Por ejemplo, 60 segundos

// Función para obtener las campañas
const getCampanas = async () => {
    try {
        const response = await axios.get('http://service-gest-cam:3001/getCampanas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las campañas:', error);
        throw error;  // Propaga el error para ser manejado más arriba
    }
};

// Función para verificar si la campaña está programada para el minuto actual
const isCampanaProgramada = (fechaProgramada, horaProgramada) => {
    const [horas, minutos] = horaProgramada.split(':');
    const fechaYHoraProgramada = momentTimezone.tz(`${fechaProgramada} ${horas}:${minutos}`, "America/Santiago");
    const nowInChile = momentTimezone.tz("America/Santiago");

    return nowInChile.isSame(fechaYHoraProgramada, 'minute');
};

// Función para iniciar el envío de una campaña
const iniciarEnvioCampana = async (campana) => {
    try {
        await axios.post('http://service-env-email:3002/iniciarEnvioCampana', { campana });
        console.log(`Envío iniciado para campaña ID: ${campana.id_campana}`);
    } catch (error) {
        console.error('Error al iniciar el envío de la campaña:', error);
        throw error;
    }
};

// Función principal que realiza el trabajo del scheduler
const startScheduler = () => {
    setInterval(async () => {
        try {
            // Obtener todas las campañas
            const campanas = await getCampanas();

            // Iterar sobre las campañas
            for (const campana of campanas) {
                if (campana.id_estado === 3) {
                    const { id_campana, fecha_programada, hora_programada } = campana;

                    // Verificar si la campaña está programada para este minuto
                    if (isCampanaProgramada(fecha_programada, hora_programada)) {
                        console.log('Objeto campana:', campana);
                        console.log('Tipo de dato de campana:', typeof campana);
                        console.log(`Iniciando envío para campaña ID: ${id_campana}`);
                        await iniciarEnvioCampana(campana);
                    } else {
                    }
                } else {
                    console.log("No hay campaña pendiente para este minuto");
                }
            }
        } catch (error) {
            console.error('Error en el scheduler de envíos:', error);
        }
    }, SCHEDULE_INTERVAL);
};

module.exports = {
    startScheduler
};