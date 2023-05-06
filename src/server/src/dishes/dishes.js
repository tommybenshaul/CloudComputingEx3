const express = require('express');
const apiNinjaHandler = require("./../../../externalApi/apininja/apiNinjaHandler.js")
const database = require('./../../../../database/neDBhandler');
const _ = require('lodash');


// const controller = require('./controller/index');
// const validateSchemas = require('../../middlewares/validateSchemas');
// const schemas = require('./utils/schemasValidation');

const router = express.Router();

// router.post(
//     '/api/v1/signup',
//     // validateSchemas.inputs(schemas.signUp, 'body'),
//     (req, res) => {
//         controller.signUp(res, req.body);
//     }
// );

router.post('',async (req, res) => {
    const { name} = req.body;
    let ninjaRes = await apiNinjaHandler.getNinjaDishes2(name)
    ninjaRes.name = name
    let doc = await database.insertDish(ninjaRes)
    res.status(201).send(doc.ID.toString())
})

router.get('/:name([a-zA-Z]+)',async (req, res) => {
    let doc = await database.getDishByName(req.params.name)
    res.json(doc)
})

router.get('/:id([0-9]+)',async (req, res) => {
    const id = parseInt(req.params.id);
    let doc = await database.getDishById(id)
    res.json(doc)
})

router.get('',async (req, res) => {
    let doc = await database.getAllDishes(req.params.name)
    res.json(doc)
})

module.exports = router;