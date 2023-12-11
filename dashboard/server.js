const { createServer } = require('http');
const next = require('next');
const mqtt = require('mqtt');
const { Temperature } = require('./models/Temperature');
const { Ph } = require('./models/Ph');
const { RotationSpeed } = require('./models/RotationSpeed');
const { TargetMetric } = require('./models/TargetMetric')
require('./db');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  // MQTT Client Setup
  const mqttClient = mqtt.connect('mqtt://test.mosquitto.org:1883');

  const server = createServer((req, res) => {
    // Check if it's a GET request and the path is '/api/update-metric'
    if (req.method === 'POST' && req.url === '/api/update-metric') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // Accumulate the data chunks
      });
      req.on('end', () => {
        if (!body) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'No data received' }));
        }
        
        try {
          const parsedBody = JSON.parse(body); // Attempt to parse the JSON
          handleUpdateMetricRequest(parsedBody, res, mqttClient);
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
      });
    } else if (req.method === 'GET' && req.url === '/api/get-target-metrics') {
        handleGetTargetMetrics(res)
    } else if (req.method === 'GET' && req.url.includes('/api/get-period')) {
      handleGetPeriod(req, res)
    } else {
      // Handle other requests
      return handle(req, res);
    }
  });

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('UCL_EE-CS_team21', (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
        return;
      }
      console.log('Subscribed to MQTT topic');
    });

    initializeTargets(mqttClient)
  });

  mqttClient.on('message', (topic, message) => {
    // Parsing message
    let data = message.toString().split(":");
    let type = data[0];
    let value = parseFloat(data[1]);
    data = [type, value]

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

async function handleUpdateMetricRequest(body, res, mqttClient) {
  let metric = body.metric; // Accessing metric from request body
  if (body.metric == "temperature"){
    metric = "temp"
  } else if(body.metric == "rotations"){
    metric = "rots"
  }
  let newValue = body.new_value; // Accessing new_value from request body

  try {
    newValue = parseFloat(newValue);
    metric = String(metric);

    const doc = await TargetMetric.findOne({ type: String(body.metric) }); // Find the document
    if (!doc) {
      throw new Error('Metric not found');
    }

    await doc.updateOne({ value: newValue }); // Update the document

    mqttClient.publish("UCL_EE-CS_team21_targets", metric+":"+String(newValue)) // Sending update to ESP32

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Metric updated successfully' }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
}

async function initializeTargets(client){
  let targets = await TargetMetric.find({})
  targets = JSON.stringify(targets)

  sendTargetMetrics(JSON.parse(targets), client)
}

function sendTargetMetrics(raw, client){
  raw.forEach((element) => {
    if(element.type == "temperature"){
      client.publish("UCL_EE-CS_team21_targets", "temp:"+String(element.value))
    } else if(element.type == "ph"){
      client.publish("UCL_EE-CS_team21_targets", "ph:"+String(element.value))
    } else if(element.type == "rotations"){
      client.publish("UCL_EE-CS_team21_targets", "rots:"+String(element.value))
    }
  })
}

async function handleGetTargetMetrics(res) {
  try {

    const target_metrics = await TargetMetric.find({}); // Find the document

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ target_metrics }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
}

async function handleGetPeriod(req, res) {

  var query = req.url;
  var urlParams = new URLSearchParams(query)
  const metric = urlParams.get('metric')
  const period = urlParams.get('period')

    // Current date and time
    var currentDate = new Date();

  if(period == '1d'){
    let oneDayAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    var filter = {
        time: {
            $gte: oneDayAgo
        }
    };
  } else if(period == '1h'){
    let oneHourAgo = new Date(currentDate.getTime() - (60 * 60 * 1000));
    var filter = {
      time: {
          $gte: oneHourAgo
      }
    };
  } else if(period == '1w'){
    let oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    var filter = {
      time: {
          $gte: oneWeekAgo
      }
    };
  } else if(period == '1m'){
    let oneMonthAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    var filter = {
      time: {
          $gte: oneMonthAgo
      }
  };
  }

  var response;

  if(metric == 'temperature'){
    try {
      response = await Temperature.find(filter); // Find the document
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err.message }));
    }
  } else if(metric == 'ph'){
    try {
      response = await Ph.find(filter); // Find the document
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err.message }));
    }
  } else if(metric == 'rotations'){
    try {
      response = await Temperature.find(filter); // Find the document
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err.message }));
    }
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Wrong url parameters.' }));
  }

  let values = [];
  let og_dates = [];

  response.forEach(item => {
    values.push(item.value);  // Add the 'value' to the values array
    og_dates.push(item.time);    // Add the 'time' to the dates array
  });

  let dates = og_dates.map(dateString => {
    // Create a new Date object from the ISO string
    let date = new Date(dateString);

    // Convert to a readable format: MM/DD/YYYY, hh:mm:ss AM/PM
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    });
});

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ values, dates }));
}


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
