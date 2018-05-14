const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/models").User;
const Wiki = require("../../src/models").Wiki;
const sequelize = require("../../src/models/index").sequelize;

describe("routes : users", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/signup", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Signup");
        done();
      });
    });
  });

  describe("GET /users/login", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}login`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Login");
        done();
      });
    });
  });

  describe("POST /users/signup", () => {

    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: `${base}signup`,
        form: {
          email: "user@example.com",
          password: "testing",
          password_conf: "testing",
          name: "Test User"
        }
      };

      request.post(options,
        (err, res, body) => {
          User.findOne({where: {email: "user@example.com"}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      const options = {
        url: base,
        form: {
          email: "invalid_user@example.com",
          password: null,
          password_conf: null,
          name: "Invalid user"
        }
      }

      request.post(options,
        (err, res, body) => {
          User.findOne({where: {email: "invalid_user@example.com"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });
});