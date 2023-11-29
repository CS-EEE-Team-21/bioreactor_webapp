const { createServer } = require('http');
const next = require('next');
const mqtt = require('mqtt');
const { Temperature } = require('./models/Temperature');
const { Ph } = require('./models/Ph');
const { RotationSpeed } = require('./models/RotationSpeed');
require('./db');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    return handle(req, res);
  });

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
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

    sendToDashboard(io, data);
  });

  server.listen(process.env.PORT || 3000, () => {
    console.log(`> Server started on http://localhost:${process.env.PORT || 3000}`);
  });
});

function sendToDashboard(io, data){
  io.emit('message', data);
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
