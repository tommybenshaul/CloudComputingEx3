const Datastore = require('nedb');
const Joi = require('joi');
const path = require('path');

const fs = require('fs');





// Define the dishes schema
const dishesSchema = Joi.object({
    ID: Joi.number().required(),
    name: Joi.string().required(),
    cal: Joi.number().min(0).required(),
    size: Joi.number().min(0).required(),
    sodium: Joi.number().min(0).required(),
    sugar: Joi.number().min(0).required(),
});
// Define the meals schema
const mealsSchema = Joi.object({
    ID: Joi.string().required(),
    appetizer: Joi.string().required(),
    main: Joi.string().required(),
    dessert: Joi.string().required(),
    sodium: Joi.number().min(0).required(),
    cal: Joi.number().min(0).required(),
    sugar: Joi.number().min(0).required(),
});
DISHES_DB_FILE_NAME = path.join(__dirname, 'data/dishes.db');
MEALS_DB_FILE_NAME = path.join(__dirname, 'data/meals.db');

if (fs.existsSync(DISHES_DB_FILE_NAME)) {
    fs.unlinkSync(DISHES_DB_FILE_NAME);
}
if (fs.existsSync(MEALS_DB_FILE_NAME)) {
    fs.unlinkSync(MEALS_DB_FILE_NAME);
}
fs.writeFileSync(DISHES_DB_FILE_NAME, '');
fs.writeFileSync(MEALS_DB_FILE_NAME, '');

const dishesDB = new Datastore({ filename: DISHES_DB_FILE_NAME, autoload: true });
const mealsDB = new Datastore({ filename:MEALS_DB_FILE_NAME , autoload: true });
dishesDB.ensureIndex({ fieldName: 'ID', unique: true }, err => {
    if (err) {
        console.error(`Error setting up dishes index: ${err}`);
    }
});

dishesDB.ensureIndex({ fieldName: 'name', unique: true }, err => {
    if (err) {
        console.error(`Error setting up dishes index: ${err}`);
    }
});
mealsDB.ensureIndex({ fieldName: 'ID', unique: true }, err => {
    if (err) {
        console.error(`Error setting up meals index: ${err}`);
    }
});

mealsDB.ensureIndex({ fieldName: 'name', unique: true }, err => {
    if (err) {
        console.error(`Error setting up meals index: ${err}`);
    }
});

const database = {
    // Insert a new user
    async insertDish(dish) {

        return new Promise((resolve, reject) => {
            dishesDB.find({},{ _id: 0 }).sort({"ID":-1}).limit(1).exec((err, results)=>{
                const lastId = results.length > 0 ? results[0].ID +1 : 1;
                dish.ID = lastId
                dishesDB.insert(dish, (err, doc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });

            })
        });
    },


    async getDishById(id) {
        return new Promise((resolve, reject) => {
            dishesDB.findOne({ ID: id }, { _id: 0 },(err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    },

    async getDishByName(name) {
        return new Promise((resolve, reject) => {
            dishesDB.findOne({ name: name },{ _id: 0 }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    } ,

    async getAllDishes() {
        return new Promise((resolve, reject) => {
            dishesDB.find({},{ _id: 0 }).sort({"ID":1}).exec((err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(doc);

            });
        });
    },

    async deleteById(id) {
        return new Promise((resolve, reject) => {
            let deletedDoc
            dishesDB.findOne({ ID:id }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                dishesDB.remove({ ID:id }, { multi: false ,_id:0}, (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(deletedDoc);
                    }
                });

            });
        });
    },

    async deleteByName(name) {
        return new Promise((resolve, reject) => {
            let deletedDoc
            dishesDB.findOne({ name }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                dishesDB.remove({ name }, { multi: false ,_id:0}, (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(deletedDoc);
                    }
                });

            });
        });
    }



    // // Find a user by email
    // async findUserByEmail(email) {
    //     try {
    //         const user = await usersDB.findOne({ email });
    //         return user;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },
    //
    // // Get all users
    // async getAllUsers() {
    //     try {
    //         const users = await usersDB.find({});
    //         return users;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },
    //
    // // Update a user by ID
    // async updateUserById(id, update) {
    //     try {
    //         const numUpdated = await usersDB.update({ _id: id }, { $set: update });
    //         return numUpdated;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },
    //
    // // Delete a user by ID
    // async deleteUserById(id) {
    //     try {
    //         const numRemoved = await usersDB.remove({ _id: id });
    //         return numRemoved;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
};

module.exports = database;