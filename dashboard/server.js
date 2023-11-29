const { createServer } = require('http');
const next = require('next');
const { WebSocketServer } = require('ws');
const mqtt = require('mqtt');
const { Temperature } = require('./models/Temperature');
const { Ph } = require('./models/Ph');
const { RotationSpeed } = require('./models/RotationSpeed');
require('./db');
// const Temperature = require('../models/temperature');

// mosquitto publication note:
// mosquitto_pub -h test.mosquitto.org -p 1883 -t UCL_EE-CS_team21 -m rots:00

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    return handle(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
});

  // MQTT Client Setup
  const mqttClient = mqtt.connect('mqtt://test.mosquitto.org:1883');

  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('UCL_EE-CS_team21', (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
        return;
      }
      console.log('Subscribed to MQTT topic');
    });
  });

  mqttClient.on('message', (topic, message) => {

    // Parsing message
    let data = message.toString().split(":");
    let type = data[0];
    let value = data[1];

    if (type == "temp"){
      registerTemperature(value);
    } else if (type == "ph"){
      registerPh(value);
    } else if (type == "rots"){
      registerRotationSpeed(value);
    }

    sendToDashboard(wss, data);
    
  });

  // Sending data to frontend through web socket
  server.listen(process.env.PORT || 3000, () => {
    console.log(`> Server started on http://localhost:${process.env.PORT || 3000}`);
  });

  // // Get all products
  // router.get('/temperature', async (req, res) => {
  //   try {
  //     const products = await Temperature.find();
  //     res.json(products);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });


});

function sendToDashboard(wss, data){
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
}

async function registerTemperature(val){
  newTemp = {
    value: val,
    time: new Date()
  }
  await Temperature.create(newTemp);
}

async function registerPh(val){
  newPh = {
    value: val,
    time: new Date()
  }
  await Ph.create(newPh);
}

async function registerRotationSpeed(val){
  newRS = {
    value: val,
    time: new Date()
  }
  await RotationSpeed.create(newRS);
}