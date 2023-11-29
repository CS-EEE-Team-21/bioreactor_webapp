const mongoose = require('mongoose');

const PhSchema = new mongoose.Schema({
    value: Number,
    time: Date,
});

mongoose.models = {};

// Use an existing model if it has already been compiled.
const Ph = mongoose.models.Ph || mongoose.model("ph", PhSchema);

module.exports = { Ph };