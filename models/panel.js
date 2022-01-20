const mongoose = require('mongoose');

const PanelScheme = new mongoose.Schema({
    ID: {type: String, required: true},
    API: {type: String, required: true},
    URL: {type: String, required: true},
    NAME: {type: String, required: true}
});

const panel = module.exports = mongoose.model('panel', PanelScheme);