const axios = require('axios');
const config = require('./../../config');
const Joi = require("joi");
const _ = require('lodash');

async function getNinjaDishes(dishesName){
    const ninjaURL ="https://api.api-ninjas.com/v1/nutrition"
    try{
        const headers = {"X-Api-Key":config.NINJA_API_KEY}
        const res = await axios.get(ninjaURL,{ params: { query: dishesName },headers:headers})
        let validation = validateNinjaData(res.data)
        if ( validation != 0) return validation
        let parsetData = parseData (res.data,dishesName)
        return parsetData
    }catch (err){
        // console.log(err)
        return -4
    }
    return -4
}
function  validateNinjaData(data){

    if (data == null) return -3
    if (!_.has(data,["0"])) return -3
    let dishObj = data["0"]
    if (!_.every(['name', 'calories','sugar_g','sodium_mg','serving_size_g'], key => _.has(dishObj, key))) {
        return -3
    }

    return 0
}
function parseData(data,name){
    const result = data.reduce((acc, obj) => {
        acc.sodium_mg += obj.sodium_mg;
        acc.sugar_g += obj.sugar_g;
        acc.calories += obj.calories;
        acc.serving_size_g += obj.serving_size_g;
        return acc;
    },{sodium_mg:0,sugar_g:0,calories:0,serving_size_g:0});
    let x = data["serving_size_g"]
    return  {cal:result.calories,sodium:result.sodium_mg,sugar:result.sugar_g,size:result.serving_size_g,name:name}
}

module.exports = {
    getNinjaDishes2 :getNinjaDishes
}

