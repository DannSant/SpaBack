const express = require('express');
const _ = require('underscore');
const app = express();
const Service = require('../models/service')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/service', verificaToken, (req, res) => {

    let id = req.query.id;


    Service.findOne({ _id: id })
        .exec((error, service) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: service
            });


        })
})

app.get('/service/all', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Service.find({ status: true })
        .skip(desde)
        .limit(limite)
        .exec((error, services) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Service.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: services
                })
            })

        })
});

//=======================
// PETICIONES POST
//=======================
app.post('/service', verificaToken, (req, res) => {
    let body = req.body;

    let service = new Service({
        name: body.name,
        desc: body.desc,
        price: body.price,
        duration: body.duration,
        img: body.img
    });

    service.save((error, serviceDB) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: serviceDB
        })

    });

});

app.post('/service/delete/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    Service.findByIdAndUpdate(id, body, { new: true }, (error, serviceDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!serviceDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró el servicio a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: serviceDB
        });

    });
});


//=======================
// PETICIONES PUT
//=======================
app.put('/service/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'desc', 'price', 'duration']);
    //console.log(req.body);

    Service.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, serviceDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!serviceDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró el servicio a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: serviceDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;