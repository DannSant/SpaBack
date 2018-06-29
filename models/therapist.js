const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let sexos = {
    values: ["M", "F"],
    message: "{VALUE} no es un sexo valido"
};

var therapistSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String, unique: true, required: [true, "El email es necesario"] },
    cellphone: { type: Number, required: [true, 'El numero de contacto es necesario'] },
    sex: { type: String, required: true, default: "F", enum: sexos },
    img: { type: String, required: false },
    status: { type: Boolean, default: true }
});



module.exports = mongoose.model("Therapist", therapistSchema);