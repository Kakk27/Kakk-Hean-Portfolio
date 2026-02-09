const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    client: { type: String },
    year: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],
    category: { type: String },
    service: { type: String },
    tags: [{ type: String }],
    isHidden: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
