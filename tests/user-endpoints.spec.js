const request = require('supertest');
const faker = require('faker');
const app = require('../app.js');
const User = require('../models/user.js');
const { getUserCookie } = require('./helpers/auth.js');

const getValidAttributes = () => ({
  email: faker.unique(faker.internet.email),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
});

const createRecord = (attributes) =>
  User.create(attributes || getValidAttributes());

let res;
let payload;

describe(`users endpoints`, () => {
  describe(`POST /users`, () => {
    describe('when not logged in', () => {
      beforeAll(async () => {
        payload = getValidAttributes();
        res = await request(app).post(`/users`).send(payload);
      });

      it('status is 401', async () => {
        expect(res.status).toBe(401);
      });
    });

    describe('when logged in as a stduent ', () => {
      beforeAll(async () => {
        payload = getValidAttributes();
        res = await request(app)
          .post(`/users`)
          .send(payload)
          .set('Cookie', await getUserCookie());
      });

      it('status is 403', async () => {
        expect(res.status).toBe(403);
      });
    });

    describe('when logged in as an admin ', () => {
      describe('when a valid payload is sent', () => {
        beforeEach(async () => {
          const cookie = await getUserCookie('admin');
          payload = getValidAttributes();
          res = await request(app)
            .post(`/users`)
            .send(payload)
            .set('Cookie', cookie);
        });

        it('returns 201 status', async () => {
          expect(res.statusCode).toEqual(201);
        });

        it('returns the id of the created user', async () => {
          expect(res.body).toHaveProperty('id');
        });

        it('does not store the plain user password', async () => {
          const userStoredInDb = await User.findOne(res.body.id);
          expect(userStoredInDb.hashedPassword).not.toBe(payload.password);
        });
      });
      describe('when a user with the same email already exists in DB', () => {
        beforeAll(async () => {
          const validEntity = await createRecord();
          res = await request(app)
            .post(`/users`)
            .send({ ...getValidAttributes(), email: validEntity.email })
            .set('Cookie', await getUserCookie('admin'));
        });

        it('returns a 422 status', async () => {
          expect(res.status).toBe(422);
        });

        it('the returned error contains "email"', async () => {
          expect(JSON.stringify(res.body).includes('email')).toBe(true);
        });
      });

      describe('when email is not provided', () => {
        beforeAll(async () => {
          res = await request(app)
            .post(`/users`)
            .send({
              password: 'zfeyfgeyfgr',
            })
            .set('Cookie', await getUserCookie('admin'));
        });

        it('returns a 422 status', async () => {
          expect(res.status).toBe(422);
        });

        it('the returned error contains "email"', async () => {
          expect(JSON.stringify(res.body).includes('email')).toBe(true);
        });
      });

      describe('when password is not provided', () => {
        beforeAll(async () => {
          res = await request(app)
            .post(`/users`)
            .send({
              email: 'jane.doe@gmail.com',
            })
            .set('Cookie', await getUserCookie('admin'));
        });

        it('returns a 422 status', async () => {
          expect(res.status).toBe(422);
        });

        it('the returned error contains "password"', async () => {
          expect(JSON.stringify(res.body).includes('password')).toBe(true);
        });
      });
    });
  });
});
