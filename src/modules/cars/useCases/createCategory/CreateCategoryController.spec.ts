import request from 'supertest';
import { app } from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const password = await hash('admin', 8);
    const id = uuidV4();
    await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin', 'admin@admin.com', '${password}', true, 'now()', '564654' )
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@admin.com', password: 'admin' });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: '22',
        description: 'Categoria de carro suv',
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category with the same name than other', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@admin.com', password: 'admin' });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: '22',
        description: 'Categoria de carro suv',
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });
});
