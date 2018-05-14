const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";

const sequelize = require("../../src/models/index").sequelize;
const Wiki = require("../../src/models").Wiki;
const User = require("../../src/models").User;
const Collaborator = require("../../src/models").Collaborator;

describe("Collaborator", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;
    this.collaborator;

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

  describe("#collaborators()", () => {
    it("should add a collaborator to the selected wiki", (done) => {
      User.create({
        name: "New Collaborator",
        email: "collaborator@example.com",
        password: "testing"
      })
      .then((user) => {
        Collaborator.create({
          wikiId: this.wiki.id,
          userId: user.id
        })
        .then((collaborator) => {
          this.collaborator = collaborator;
          expect(collaborator.wikiId).toBe(this.wiki.id);
          expect(collaborator.userId).toBe(user.id);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
    })

  });

  describe("#destroy()", () => {
    it("should delete the specified collaborator from wiki", (done) => {
      Collaborator.destroy({
        where: {id: this.collaborator.id}
      })
      .then((collaborator) => {
        expect(collaborator.id).toBe(undefined);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    })
  });
});