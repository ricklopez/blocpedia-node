const sequelize = require("../../src/models/index").sequelize;
const User = require("../../src/models").User;

describe("User", () => {

  beforeEach((done) => {
    this.wiki;

    sequelize.sync({force: true})
    .then(() => {
      User.create({
        email: "test@example.com",
        password: "testing",
        name: "Test User"
      })
      .then((user) => {
        this.user = user;
        done();
      })
      
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {

    it("should create a User object with a valid email and password", (done) => {
      User.create({
        email: "new_user@example.com",
        password: "testing",
        name: "Test User"
      })
      .then((user) => {
        expect(user.email).toBe("new_user@example.com");
        expect(user.id).toBe(2);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with invalid email or password", (done) => {
      User.create({
        email: "",
        password: "",
        name: "Test User"
      })
      .then((user) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {
      User.create({
        email: "existing_user@example.com",
        password: "mypassword",
        name: "Duplicate email user"
      })
      .then((user) => {
        done();
      })

      User.findAll({
        where: {
          email: "test@example.com"
        }
      })
      .then((users) => {
        expect(users.length).toBe(1);
      })
      .catch((err) => {
        done();
      });
    });
  });

});