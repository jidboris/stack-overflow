const { mongoose } = require('mongoose');
const postModel = new mongoose.Schema({
    Title: {
        type: String
    },

    Content: {
        type: String
    },

    updated: {
        type: Date, default: Date.now
    },
});

module.exports = mongoose.model('Posts', postModel);