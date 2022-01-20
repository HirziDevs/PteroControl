const mongoose = require('mongoose');

const AdminScheme = new mongoose.Schema({
    ids: {type: String, required: true},
    API: {type: String, required: true},
    URL: {type: String, required: true},
    NAME: {type: String, required: true}
});

const admin = module.exports = mongoose.model('admin', AdminScheme);