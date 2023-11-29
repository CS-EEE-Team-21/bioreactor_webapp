const mongoose = require('mongoose');

const RotationSpeedSchema = new mongoose.Schema({
    value: Number,
    time: Date,
});

mongoose.models = {};

// Use an existing model if it has already been compiled.
const RotationSpeed = mongoose.models.RotationSpeed || mongoose.model("rotation_speed", RotationSpeedSchema);

module.exports = { RotationSpeed };