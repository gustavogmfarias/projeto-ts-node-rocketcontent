import request from 'supertest';
import { app } from '@shared/infra/http/app';

import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeEach(async () => {
    connection = await createConnection();

    const password = await hash('admin', 8);
    const id = uuidV4();
    await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin', 'admin@admin.com', '${password}', true, 'now()', '564654' )
    `);
  });

  it('should be able to create a new category', async () => {
    const response = await request(app).post('/categories').send({
      name: '22',
      description: 'Categoria de carro suv',
    });

    expect(response.status).toBe(201);
  });
});
