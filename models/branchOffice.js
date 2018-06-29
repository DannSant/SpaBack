const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let sexos = {
    values: ["M", "F", "FM"],
    message: "{VALUE} no es un sexo valido"
};

var branchOfficeSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    address: { type: String, required: [true, "La direccion es necesaria"] },
    lat: { type: Number, required: [true, 'Latitud  es necesaria'] },
    lng: { type: Number, required: [true, 'Longitud  es necesaria'] },
    allowedGenres: { type: String, required: true, default: "FM", enum: sexos },
    img: { type: String, required: false },
    status: { type: Boolean, default: true }
});



module.exports = mongoose.model("BranchOffice", branchOfficeSchema);