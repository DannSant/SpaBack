const express = require('express');
const _ = require('underscore');
const app = express();
const Appointment = require('../models/appointment')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/appointment', verificaToken, (req, res) => {

    let id = req.query.id;


    Appointment.findOne({ _id: id })
        .populate('user', 'name email cellphone')
        .populate('therapist')
        .populate('service')
        .populate('branchOffice')
        .exec((error, appointment) => {
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

app.get('/appointment/all', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Appointment.find()
        .populate('user', 'name email cellphone')
        .populate('therapist')
        .populate('service')
        .populate('branchOffice')
        .skip(desde)
        .limit(limite)
        .exec((error, appointments) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Appointment.count((e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: appointments
                });
            });

        });
});



//=======================
// PETICIONES POST
//=======================
app.post('/appointment/make', verificaToken, (req, res) => {
    let body = req.body;

    let appointment = new Appointment({
        user: body.user,
        date: body.date,
        price: body.price,
        service: body.service,
        branchOffice: body.branchOffice
    });

    appointment.creationDate = new Date();

    appointment.save((error, appointment) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            data: appointment
        });

    });

});

app.post('/appointment/getByDate', verificaToken, (req, res) => {

    let body = req.body;



    let desde = body.desde;
    desde = Number(desde);

    let limite = body.limite;
    limite = Number(limite);

    let dateFrom = body.dateFrom;
    dateFrom = new Date(Number(dateFrom));

    let dateTo = body.dateTo;
    dateTo = new Date(Number(dateTo));


    Appointment.find({ "date": { "$gte": dateFrom, "$lt": dateTo } })
        .populate('user', 'name email cellphone')
        .populate('therapist')
        .populate('service')
        .populate('branchOffice')
        .skip(desde)
        .limit(limite)
        .exec((error, appointments) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Appointment.count({ "date": { "$gte": dateFrom, "$lt": dateTo } }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: appointments
                });
            });

        });
});

app.post('/appointment/current', verificaToken, (req, res) => {

    let user = req.usuario;
    let currentDate = new Date();
    Appointment.find({ "date": { "$gte": currentDate } }, { "user": user._id })
        .populate('user', 'name email cellphone')
        .populate('therapist')
        .populate('service')
        .populate('branchOffice')
        .select('user date status price therapist service branchOffice creationDate')
        .exec((error, appointments) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                data: appointments
            });



        });
});

app.post('/appointment/past', verificaToken, (req, res) => {

    let user = req.usuario;
    let currentDate = new Date();
    Appointment.find({ "date": { "$lt": currentDate } }, { "user": user._id })
        .populate('user', 'name email cellphone')
        .populate('therapist')
        .populate('service')
        .populate('branchOffice')
        .select('user date status price therapist service branchOffice creationDate')
        .exec((error, appointments) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                data: appointments
            });



        });
});


//=======================
// PETICIONES PUT
//=======================
app.put('/appointment/changeStatus/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['status']);
    //console.log(req.body);

    Appointment.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, appointmentDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!appointmentDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró la cita a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: appointmentDB
        });

    });
});

app.put('/appointment/reschedule/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['date']);
    //console.log(req.body);

    Appointment.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, appointmentDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!appointmentDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró la cita a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: appointmentDB
        });

    });
});

app.put('/appointment/assign/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['therapist']);


    Appointment.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, appointmentDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!appointmentDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró la cita a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: appointmentDB
        });

    });
});


module.exports = app;