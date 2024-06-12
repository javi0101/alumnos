const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
  curso: String,
  foto: String,
  calificaciones: {
    primerParcial: Number,
    segundoParcial: Number,
    ordinario: Number,
    extra: Number,
    titulo: Number
  }
});

module.exports = mongoose.model('Alumno', alumnoSchema);
