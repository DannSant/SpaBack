const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let statuses = {
    values: ["PENDING", "CONFIRMED", "UNREACHED", "CANCELLED", "ATTENDED"],
    message: "{VALUE} no es un status valido"
};

var appointmentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: [true, "El día es necesario"] },
    status: { type: String, required: true, default: "PENDING", enum: statuses },
    price: { type: Number, required: true },
    therapist: { type: Schema.Types.ObjectId, ref: 'Therapist', default: null },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    branchOffice: { type: Schema.Types.ObjectId, ref: 'BranchOffice', required: true },
    creationDate: { type: Date },
});



module.exports = mongoose.model("Appointment", appointmentSchema);