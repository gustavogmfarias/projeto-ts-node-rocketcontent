import request from 'supertest';
import { app } from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

let connection: Connection;

describe('List Categories Controller', () => {
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

  it('should be able able to list all available categories', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@admin.com', password: 'admin' });

    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: '30',
        description: 'Categoria de carro suv',
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app).get('/categories');
    console.log(response.body);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toEqual('30');
  });
});
