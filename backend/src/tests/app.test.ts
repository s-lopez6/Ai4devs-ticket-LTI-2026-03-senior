import request from 'supertest';
import { app } from '../index';

describe('GET /', () => {
  it('responds with Hello World!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('adds x-request-id header', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBeTruthy();
  });
});

describe('CORS', () => {
  it('sets CORS headers for allowed origin', async () => {
    const origin = 'http://localhost:3000';
    const response = await request(app).get('/').set('Origin', origin);
    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(origin);
  });

  it('responds to preflight OPTIONS for allowed origin', async () => {
    const origin = 'http://localhost:3000';
    const response = await request(app)
      .options('/')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'GET');

    expect(response.statusCode).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(origin);
  });
});
