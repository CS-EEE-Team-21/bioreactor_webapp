const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
    value: Number,
    time: Date,
});

mongoose.models = {};

// Use an existing model if it has already been compiled.
const Temperature = mongoose.models.Temperature || mongoose.model("temperature", TemperatureSchema);

module.exports = { Temperature };