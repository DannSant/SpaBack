const express = require('express');
const _ = require('underscore');
const app = express();
const BranchOffice = require('../models/branchOffice')
const { verificaToken, verificaAdmin } = require('../middlewares/auth')

//=======================
// PETICIONES GET
//=======================
app.get('/branchOffice', verificaToken, (req, res) => {

    let id = req.query.id;


    BranchOffice.findOne({ _id: id })
        .exec((error, branchOffice) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            res.json({
                ok: true,
                records: 1,
                data: branchOffice
            });


        });
})

app.get('/branchOffice/all', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    BranchOffice.find({ status: true })
        .skip(desde)
        .limit(limite)
        .exec((error, branchOffices) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            BranchOffice.count({ status: true }, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: branchOffices
                });
            });

        });
});

//=======================
// PETICIONES POST
//=======================
app.post('/branchOffice', verificaToken, (req, res) => {
    let body = req.body;

    let brachOffice = new BranchOffice({
        name: body.name,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        allowedGenres: body.allowedGenres,
        img: body.img
    });

    brachOffice.save((error, brachOfficeDB) => {

        if (error) {
            return res.status(409).json({
                ok: false,
                error
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: brachOfficeDB
        });

    });

});

app.post('/branchOffice/delete/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status']);

    body.status = false


    BranchOffice.findByIdAndUpdate(id, body, { new: true }, (error, brachOfficeDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!brachOfficeDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró la sucursal a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: brachOfficeDB
        });

    });
});


//=======================
// PETICIONES PUT
//=======================
app.put('/branchOffice/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['name', 'address', 'lat', 'lng', 'allowedGenres']);
    //console.log(req.body);

    BranchOffice.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, brachOfficeDB) => {
        if (error) {
            return res.status(409).json({
                ok: false,
                error
            })
        }

        if (!brachOfficeDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró la sucursal a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: brachOfficeDB
        });

    });
});


//=======================
// Exportar rutas
//=======================
module.exports = app;