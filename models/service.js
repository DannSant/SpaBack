const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var serviceSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    desc: { type: String, required: [true, "La descripcion es necesaria"] },
    price: { type: Number, required: [true, 'El precio es necesario'] },
    duration: { type: Number, required: true, default: 0 },
    img: { type: String, required: false },
    status: { type: Boolean, default: true }
});



module.exports = mongoose.model("Service", serviceSchema);