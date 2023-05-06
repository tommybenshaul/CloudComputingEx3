const request = require("supertest");
const { expect } = require("chai");
const app = require("./../src/server/app");



describe("Dishes API", () => {
    const newDish = {
        name: "Spaghetti Carbonara"
    }

    it("should add a new dish", (done) => {
        request(app)
            .post("/dishes")
            .send(newDish)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(newDishId).to.equal("1");
                done();
            });
    });

    it("should get all dishes", (done) => {
        request(app)
            .get("/dishes")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.above(0);
                done();
            });
    });

    it("should get a specific dish by ID", (done) => {
        request(app)
            .get(`/dishes/${newDishId}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.id).to.equal(newDishId);
                done();
            });
    });

    it("should update a specific dish by ID", (done) => {
        const updatedDish = {
            name: "Updated Spaghetti Carbonara",
            calories: 1000,
            size: "Medium",
            sodium: 900,
            sugar: 20,
        };
        request(app)
            .put(`/dishes/${newDishId}`)
            .send(updatedDish)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.id).to.equal(newDishId);
                expect(res.body.name).to.equal(updatedDish.name);
                expect(res.body.calories).to.equal(updatedDish.calories);
                expect(res.body.size).to.equal(updatedDish.size);
                expect(res.body.sodium).to.equal(updatedDish.sodium);
                expect(res.body.sugar).to.equal(updatedDish.sugar);
                done();
            });
    });

    it("should delete a specific dish by ID", (done) => {
        request(app)
            .delete(`/dishes/${newDishId}`)
            .expect(204)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
