const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let rolesValidos = {
    values: ["USER_ROLE", "ADMIN_ROLE", "EMPLOYEE_ROLE", "THERAPIST_ROLE"],
    message: "{VALUE} no es un rol valido"
};

let sexos = {
    values: ["M", "F"],
    message: "{VALUE} no es un sexo valido"
};

var userSchema = new Schema({
    name: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String, unique: true, required: [true, "El email es necesario"] },
    cellphone: { type: Number, required: [true, 'El numero de contacto es necesario'] },
    sex: { type: String, required: true, default: "F", enum: sexos },
    password: { type: String, required: [true, "El password es necesario"] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos },
    status: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("User", userSchema);