import request from 'supertest';

import app from '../app.js';
import FILE_CONSTANTS from '@dam/shared/constants'

import type { ICreateUserResponseDto } from '../dto/response/auth-response-dto.js';

describe('AUTH API', () => {
  describe('POST /v1/api/login', () => {
    it('should login successfully', async () => {
      const response = await request(app).post('/v1/api/login').send({
        email: 'admin@example.com',
        password: 'Admin@123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app).post('/v1/api/login').send({
        email: 'admin@example.com',
        password: 'wrong',
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app).post('/v1/api/login').send({
        email: 'invalid@example.com',
        password: 'Admin@123',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app).post('/v1/api/login').send({
        email: '',
        password: 'Admin@123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app).post('/v1/api/login').send({
        email: 'admin@example.com',
        password: '',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /v1/api/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/v1/api/register').send({
        name: 'TestUser',
        email: `test${Date.now()}@example.com`,
        password: 'Password@123',
      });

      const body = response.body as ICreateUserResponseDto;

      expect(response.status).toBe(201);
      expect(body.message).toBe(FILE_CONSTANTS.MESSAGES.AUTH.USER_REGISTERED);
      expect(body.result).toHaveProperty('id');
      expect(body.result.email).toContain('@example.com');
    });

    it('should return 400 if user already exists', async () => {
      const response = await request(app).post('/v1/api/register').send({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Password@123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app).post('/v1/api/register').send({
        name: '',
        email: 'user@example.com',
        password: 'Password@123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app).post('/v1/api/register').send({
        name: 'Test User',
        email: '',
        password: 'Password@123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app).post('/v1/api/register').send({
        name: 'Test User',
        email: 'user@example.com',
        password: '',
      });

      expect(response.status).toBe(400);
    });
  });
});