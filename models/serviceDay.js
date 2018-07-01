const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var serviceDaySchema = new Schema({
    day_desc: { type: String, unique: true, required: [true, "El día es necesario"] },
    branchOffice: { type: Schema.Types.ObjectId, ref: 'BranchOffice', required: true },
    businessHours: { type: String, required: [true, 'Es necesario especificar horarios'] }

});

serviceDaySchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("ServiceDay", serviceDaySchema);