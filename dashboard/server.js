const { createServer } = require('http');
const next = require('next');
const { WebSocketServer } = require('ws');
const mqtt = require('mqtt');

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
    console.log(`MQTT message received on topic ${topic}: ${message.toString()}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  server.listen(process.env.PORT || 3000, () => {
    console.log(`> Server started on http://localhost:${process.env.PORT || 3000}`);
  });
});
