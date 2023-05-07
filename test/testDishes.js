const request = require("supertest");
const { expect } = require("chai");
const app = require("./../src/server/app");



describe("Dishes API", () => {

    const firstAddDish = {
        ID:1,
        name:"Spaghetti"
    }

    const secoundAddDish = {
        ID:2,
        name:"pig"
    }

    function testGetAllDishes(done) {
        request(app)
            .get("/dishes")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(Object.keys(res.body)).to.have.lengthOf.at.least(1);
                Object.keys(res.body).forEach((key) => {
                    expect(Number.isInteger(Number(key))).to.be.true;
                    expect(res.body[key]).to.have.property("ID", Number(key));
                });
                done();
            });
    }
    function createDish(done,dishName,expectId,expectedStatus = 201) {
        request(app)
            .post("/dishes")
            .send({name: dishName})
            .expect(expectedStatus)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(newDishId).to.equal(expectId);
                done();
            });
    }

    function deleteTest(done,dishNameOrId,expectedReturn,expectCode){
        request(app)
            .delete(`/dishes/${dishNameOrId}`)
            .expect(expectCode)
            .end((err, res) => {
                expect(res.text).to.equal(expectedReturn);
                if (err) return done(err);
                done();
            });
    }


    it("should add a new dish", (done) => {
        createDish(done, firstAddDish.name ,firstAddDish.ID.toString());
    });

    it("should add a secound dish", (done) => {
        createDish(done,secoundAddDish.name ,secoundAddDish.ID.toString());
    });

    it("should add a secound dish again", (done) => {
        createDish(done,secoundAddDish.name ,"-2",422);
    });

    it("should add a non exsisting dish dish again", (done) => {
        createDish(done,"sadasfasfas" ,"-3",422);
    });


    it("should add a 3 dish", (done) => {
        createDish(done,"Spaghetti Carbonara" ,"3");
    });

    it("should get all dishes", (done) => {
        testGetAllDishes(done)
    });

    it("should get a specific dish by ID", (done) => {
        request(app)
            .get(`/dishes/2`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.ID).to.equal(secoundAddDish.ID);
                expect(res.body.name).to.equal(secoundAddDish.name);
                done();
            });
    });


    it("delete non exsisting id", (done) => {
        deleteTest(done,"200","-5",404)
    });

    it("delete non exsisting name", (done) => {
        deleteTest(done,"blabla","-5",404)
    });

    it("delete second dish", (done) => {
        deleteTest(done,secoundAddDish.name,secoundAddDish.ID.toString(),200)
    });

    it("delete first dish", (done) => {
        deleteTest(done,firstAddDish.name,firstAddDish.ID.toString(),200)
    });


    it("should get all dishes", (done) => {
        testGetAllDishes(done)
    });

});

describe("sending wrong params", () => {
    it("should return 415 for non-JSON content types on POST requests", (done) => {
        request(app)
            .post("/dishes")
            .set("Content-Type", "text/plain")
            .send("this is not JSON")
            .expect(415)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("0");
                done();
            });
    });

    it("should return -1 and 422 status code for invalid dish", (done) => {
        request(app)
            .post("/dishes")
            .send({name: ""})
            .set("Content-Type", "application/json")
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-1");
                done();
            });
    });


    it("delete main route", (done) => {
        request(app)
            .delete(`/dishes`)
            .expect(405)
            .end((err, res) => {
                expect(res.text).to.equal("-5");
                if (err) return done(err);
                done();
            });
    });

    it("delete no val", (done) => {
        request(app)
            .delete(`/dishes/`)
            .expect(405)
            .end((err, res) => {
                expect(res.text).to.equal("-5");
                if (err) return done(err);
                done();
            });
    });

    // tests for error handling and validation
});

