const request = require('supertest');
const faker = require('faker');
const app = require('../app.js');
const Note = require('../models/note.js');

const getValidAttributes = () => ({
  title: faker.datatype.string().substr(0, 20),
  content: faker.datatype.string(),
});

const createRecord = (attributes) =>
  Note.create(attributes || getValidAttributes());

let res;
let testedEntity;
let payload;

describe(`notes endpoints`, () => {
  describe(`GET /notes`, () => {
    describe('when there are two items in DB', () => {
      beforeEach(async () => {
        await Promise.all([createRecord(), createRecord()]);
        res = await request(app).get('/notes');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned body is an array containing two elements', async () => {
        expect(Array.isArray(res.body));
        expect(res.body.length).toBe(2);
      });

      it('the returned elements have expected properties', async () => {
        const expectedProps = ['id', 'title', 'content'];
        res.body.forEach((element) => {
          expectedProps.forEach((prop) => {
            expect(element[prop]).not.toBe(undefined);
          });
        });
      });
    });
  });
  describe(`GET /notes/:id`, () => {
    describe('with existing entity id', () => {
      beforeAll(async () => {
        testedEntity = await createRecord();
        res = await request(app).get(`/notes/${testedEntity.id}`);
      });

      it('returns 200', () => {
        expect(res.status).toBe(200);
      });

      it('returned object in body has correct properties', () => {
        const expectedProps = ['id', 'title', 'content', 'tags'];
        expectedProps.forEach((prop) => {
          expect(res.body[prop]).not.toBe(undefined);
        });
      });
    });

    describe('with non-existing entity id', () => {
      beforeAll(async () => {
        res = await request(app).get(`/notes/9999999999`);
      });

      it('returns 404', () => {
        expect(res.status).toBe(404);
      });
    });
  });
  describe(`POST /notes`, () => {
    describe('when a valid payload is sent', () => {
      beforeAll(async () => {
        payload = getValidAttributes();
        res = await request(app).post(`/notes`).send(payload);
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created note', async () => {
        expect(res.body).toHaveProperty('id');
      });
    });

    describe('with tags', () => {
      beforeAll(async () => {
        payload = getValidAttributes();
        payload.tags = [{ name: 'tag1' }, { name: 'tag2' }];
        res = await request(app).post(`/notes`).send(payload);
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the tags with the created note', async () => {
        expect(res.body.tags.length).toEqual(2);
        res.body.tags.forEach((tag) => {
          expect(tag).toHaveProperty('id');
          expect(tag).toHaveProperty('name');
        });
        expect(res.body.tags.map((tag) => tag.name)).toEqual(['tag1', 'tag2']);
      });
    });

    describe('when title is not provided', () => {
      beforeAll(async () => {
        res = await request(app).post(`/notes`).send({
          content: 'test',
        });
      });

      it('returns a 422 status', async () => {
        expect(res.status).toBe(422);
      });

      it('returned error contains "title"', async () => {
        expect(JSON.stringify(res.body).includes('title')).toBe(true);
      });
    });

    describe('when title exceed 255 caracters', () => {
      beforeAll(async () => {
        res = await request(app).post(`/notes`).send({
          title:
            'Janeiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyguygfaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuy',
          content: 'test',
        });
      });

      it('returns a 422 status', async () => {
        expect(res.status).toBe(422);
      });

      it('returned error contains "title"', async () => {
        expect(JSON.stringify(res.body).includes('title')).toBe(true);
      });
    });
  });
  describe(`PATCH /notes/:id`, () => {
    describe('with a valid entity', () => {
      beforeEach(async () => {
        testedEntity = await createRecord();
        payload = getValidAttributes();
        res = await request(app)
          .patch(`/notes/${testedEntity.id}`)
          .send(payload);
      });

      it('returns 200', () => {
        expect(res.status).toBe(200);
      });

      it('returns the entity with correct properties', () => {
        expect(res.body.id).toBe(testedEntity.id);
        Object.keys(payload).forEach((k) => {
          expect(res.body[k]).toBe(payload[k]);
        });
      });
    });
    describe('with an non-existing entity id', () => {
      beforeAll(async () => {
        res = await request(app)
          .put(`/notes/99999999`)
          .send({ first_name: 'jane' });
      });

      it('returns 404', () => {
        expect(res.status).toBe(404);
      });
    });

    describe('when title exceed 255 caracters', () => {
      beforeAll(async () => {
        testedEntity = await createRecord();
        res = await request(app).patch(`/notes/${testedEntity.id}`).send({
          title:
            'Janeiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyguygfaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuyaneiuzyegfuyezgfuyzfgzuyegfzeuyfguzyegfuyzgfuyzegfuzgefugyzeufygzeuy',
          content: 'test',
        });
      });

      it('returns a 422 status', async () => {
        expect(res.status).toBe(422);
      });

      it('returned error contains "title"', async () => {
        expect(JSON.stringify(res.body).includes('title')).toBe(true);
      });
    });
  });
  describe(`DELETE /notes/:id`, () => {
    describe('with a valid entity', () => {
      beforeAll(async () => {
        const note = await createRecord();
        res = await request(app).delete(`/notes/${note.id}`);
      });
      it('returns 204', () => {
        expect(res.status).toBe(204);
      });
    });
    describe('with an non-existing entity id', () => {
      beforeAll(async () => {
        res = await request(app).delete(`/notes/99999999`);
      });

      it('returns 404', () => {
        expect(res.status).toBe(404);
      });
    });
  });
});
