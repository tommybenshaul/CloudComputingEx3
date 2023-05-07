const express = require('express');
const apiNinjaHandler = require("./../../../externalApi/apininja/apiNinjaHandler.js")
const database = require('./../../../../database/neDBhandler');
const _ = require('lodash');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./schemasValidation');



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

router.post('',  validateSchemas.inputs(schemas.addDish, 'body'),async (req, res) => {

    const { name} = req.body;
    let ninjaRes = await apiNinjaHandler.getNinjaDishes2(name)
    if (_.isNumber(ninjaRes)){
        let statusCode = ninjaRes === -3 ? 422 : 504
        res.status(statusCode).send(ninjaRes.toString())
        return
    }
    ninjaRes.name = name
    try {
        let doc = await database.insertDish(ninjaRes)
        res.status(201).send(doc.ID.toString())
    }catch (err){
        res.status(422).send("-2")
    }

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
    const result = _.keyBy(doc, 'ID');
    res.json(result)
})
router.delete('/:name([a-zA-Z]+)',async (req, res) => {
    let doc = await database.deleteByName(req.params.name)
    if (doc == undefined || _.isEmpty(doc)) {
        res.status(404).send("-5")
        return
    }
    res.json(doc.ID)
})

router.delete('/:id([0-9]+)',async (req, res) => {
    const id = parseInt(req.params.id);
    let doc = await database.deleteById(id)
    if (doc == undefined || _.isEmpty(doc)) {
        res.status(404).send("-5")
        return
    }
    res.json(doc.ID)
})

router.delete('',async (req, res) => {
    res.status(405).send("-5")
})

module.exports = router;