const mongoose = require('mongoose');

const TargetMetricchema = new mongoose.Schema({
    type: String,
    value: Number,
});

mongoose.models = {};

// Use an existing model if it has already been compiled.
const TargetMetric = mongoose.models.TargetMetric || mongoose.model("target", TargetMetricchema);

module.exports = { TargetMetric };