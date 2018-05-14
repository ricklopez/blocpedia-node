const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";

const sequelize = require("../../src/models/index").sequelize;
const Wiki = require("../../src/models").Wiki;
const User = require("../../src/models").User;

describe("Wiki", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "test@example.com",
        password: "testing",
        name: "Test User"
     })
     .then((user) => {
       this.user = user;
       Wiki.create({
        title: "My new wiki",
        body: "Testing wiki creation",
        private: false,
        UserId: user.id
       })
       .then((wiki) => {
         this.wiki = wiki;
         done();
       })
     })
   });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title, body", (done) => {
      Wiki.create({
        title: "Wiki 1",
        body: "Testing newly created wiki",
        private: false,
        UserId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Wiki 1");
        expect(wiki.body).toBe("Testing newly created wiki");
        expect(wiki.private).toBe(false);
        expect(wiki.UserId).toBe(this.user.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#destroy()", () => {
    it("should delete the specified wiki", (done) => {
      Wiki.destroy({where: {id: this.wiki.id}})
      .then((wiki) => {
        expect(wiki.title).toBe(undefined);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});