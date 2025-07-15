const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}
    passaword: {type: String, required: true },
    tipo: { type: String, enum: ['aluno', 'professor'], required: true }
});

module.exports = mongoose.model('User', userSchema);