const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuración de body-parser para manejar datos POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://mongo/alumnosDB');

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

// Configuración de la carpeta de archivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Modelo de Alumnos
const Alumno = require('./models/alumno');

// Ruta para la página principal con el formulario
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para crear un nuevo alumno
app.post('/alumnos', async (req, res) => {
  try {
    const nuevoAlumno = new Alumno({
      nombre: req.body.nombre,
      edad: req.body.edad,
      curso: req.body.curso,
      foto: '',
      calificaciones: {
        primerParcial: 0,
        segundoParcial: 0,
        ordinario: 0,
        extra: 0,
        titulo: 0
      }
    });
    await nuevoAlumno.save();
    res.redirect('/');
  } catch (err) {
    res.send(err);
  }
});

// Ruta para obtener todos los alumnos
app.get('/alumnos', async (req, res) => {
  try {
    const alumnos = await Alumno.find({});
    res.render('alumnos', { alumnos: alumnos });
  } catch (err) {
    res.send(err);
  }
});

// Ruta para actualizar un alumno
app.post('/alumnos/actualizar/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndUpdate(req.params.id, {
      nombre: req.body.nombre,
      edad: req.body.edad,
      curso: req.body.curso
    });
    res.redirect('/alumnos');
  } catch (err) {
    res.send(err);
  }
});

// Ruta para eliminar un alumno
app.delete('/alumnos/eliminar/:id', async (req, res) => {
  try {
    console.log(`Intentando eliminar el alumno con id: ${req.params.id}`);
    const resultado = await Alumno.findByIdAndDelete(req.params.id);
    if (resultado) {
      console.log('Alumno eliminado con éxito');
      res.sendStatus(200);
    } else {
      console.log('Alumno no encontrado');
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('Error al eliminar el alumno:', err);
    res.sendStatus(500);
  }
});

// Ruta para ver más información del alumno
app.get('/alumnos/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    res.render('detalle', { alumno: alumno });
  } catch (err) {
    res.send(err);
  }
});

// Ruta para actualizar foto y calificaciones del alumno
app.post('/alumnos/:id/detalle', upload.single('foto'), async (req, res) => {
  try {
    const calificaciones = {
      primerParcial: req.body.primerParcial,
      segundoParcial: req.body.segundoParcial,
      ordinario: req.body.ordinario,
      extra: req.body.extra,
      titulo: req.body.titulo
    };
    const foto = req.file ? req.file.path : req.body.fotoActual;
    await Alumno.findByIdAndUpdate(req.params.id, {
      foto: foto,
      calificaciones: calificaciones
    });
    res.redirect(`/alumnos/${req.params.id}`);
  } catch (err) {
    res.send(err);
  }
});
