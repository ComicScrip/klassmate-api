const request = require('supertest');
const faker = require('faker');
const app = require('../app.js');
const User = require('../models/user.js');

const getValidAttributes = () => ({
  email: faker.unique(faker.internet.email),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
});

const createRecord = (attributes) =>
  User.create(attributes || getValidAttributes());

let res;

describe(`students endpoints`, () => {
  describe(`GET /students`, () => {
    describe('when there are two items in DB', () => {
      beforeEach(async () => {
        await Promise.all([createRecord(), createRecord()]);
        res = await request(app).get('/students');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned body is an array containing two elements', async () => {
        expect(Array.isArray(res.body));
        expect(res.body.length).toBe(2);
      });

      it('the returned elements have expected properties', async () => {
        const expectedProps = ['id', 'firstName', 'lastName'];
        res.body.forEach((element) => {
          expectedProps.forEach((prop) => {
            expect(element[prop]).not.toBe(undefined);
          });
        });
      });
    });
  });
});
