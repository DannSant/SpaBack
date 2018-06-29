const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Therapist = require('../models/therapist')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/therapist', verificaToken, (req, res) => {

    let id = req.query.id;


    Therapist.findOne({ _id: id })
        .exec((error, therapist) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: therapist
            });


        })
})

app.get('/therapist/all', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Therapist.find({ status: true })
        .skip(desde)
        .limit(limite)
        .exec((error, therapists) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Therapist.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: therapists
                })
            })

        })
});

//=======================
// PETICIONES POST
//=======================
app.post('/therapist', verificaToken, (req, res) => {
    let body = req.body;

    let therapist = new Therapist({
        name: body.name,
        email: body.email,
        cellphone: body.cellphone,
        sex: body.sex,
        img: body.img
    });

    therapist.save((error, therapistDB) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: therapistDB
        })

    });

});

app.post('/therapist/delete/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    Therapist.findByIdAndUpdate(id, body, { new: true }, (error, therapistDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!therapistDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al masajista a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: therapistDB
        });

    });
});


//=======================
// PETICIONES PUT
//=======================
app.put('/therapist/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'cellphone', 'sex']);
    //console.log(req.body);

    Therapist.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, therapistDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!therapistDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al masajista a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: therapistDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;