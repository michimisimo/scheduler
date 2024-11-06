const express = require('express');
const { startScheduler } = require('./services/schedulerService');
const cors = require('cors');

const app = express();
const PORT = 3021;
app.use(cors());

// Iniciar el scheduler
startScheduler();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Scheduler service running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('¡Hola desde el scheduler!');
});