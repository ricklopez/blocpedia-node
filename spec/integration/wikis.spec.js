const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";

const sequelize = require("../../src/models/index").sequelize;
const Wiki = require("../../src/models").Wiki;
const User = require("../../src/models").User;

describe("routes : posts", () => {

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

  describe("signed in user trying to create a wiki", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/mock/auth",
        form: {
          role: this.user.role,
          userId: this.user.id,
          email: this.user.email
        }
      });
      done();
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("My new wiki");
          done();
        });
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", (done) => {
      expect(this.wiki.id).toBe(1);

      request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findById(1)
        .then((wiki) => {
          expect(err).toBeNull();
          expect(wiki).toBeNull();
          done();
        })
      });
    });
  });

});