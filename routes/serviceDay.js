const express = require('express');
const _ = require('underscore');
const app = express();
const ServiceDay = require('../models/serviceDay')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/serviceDay', verificaToken, (req, res) => {

    let id = req.query.id;


    ServiceDay.findOne({ _id: id })
        .populate('BranchOffice')
        .exec((error, serviceDay) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: serviceDay
            });


        });
})

app.get('/serviceDay/all', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    ServiceDay.find()
        .populate('branchOffice')
        .skip(desde)
        .limit(limite)
        .exec((error, serviceDays) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            ServiceDay.count((e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: serviceDays
                });
            });

        });
});

//=======================
// PETICIONES POST
//=======================
app.post('/serviceDay', verificaToken, (req, res) => {
    let body = req.body;

    let serviceDay = new ServiceDay({
        day_desc: body.day_desc,
        branchOffice: body.branchOffice,
        businessHours: body.businessHours
    });

    serviceDay.save((error, serviceDay) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: serviceDay
        });

    });

});



//=======================
// PETICIONES PUT
//=======================
app.put('/serviceDay/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['day_desc', 'branchOffice', 'businessHours']);
    //console.log(req.body);

    ServiceDay.findById(code, (error, serviceDayDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!serviceDayDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró el día de servicio a actualizar"
                }
            })
        }

        serviceDayDB.day_desc = body.day_desc;
        serviceDayDB.branchOffice = body.branchOffice;
        serviceDayDB.businessHours = body.businessHours;

        serviceDayDB.save((err, savedServiceDay) => {
            if (err) {
                return res.status(409).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                data: serviceDayDB
            });
        })
    })

});


//=======================
// PETICIONES DELETE
//=======================
app.delete('/serviceDay/:id', [verificaToken], function(req, res) {
    let id = req.params.id;


    ServiceDay.findByIdAndRemove(id, (error, serviceDayDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!serviceDayDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró el día de servicio a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: serviceDayDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;