// import request from 'supertest';

// import app from '../app.js';

// import type { ILoginResponseDto } from '../dto/response/auth-response-dto.js';
// import type { IGetFileCountResponseDto } from '../dto/response/file-response-dto.js';

// describe('FILE API', () => {
//   let token: string;

//   beforeAll(async () => {
//     const login = await request(app).post('/v1/api/login').send({
//       email: 'admin@example.com',
//       password: 'Admin@123',
//     });

//     expect(login.status).toBe(200);

//     const body = login.body as ILoginResponseDto;
//     token = body.token;

//     console.log(token);
//   });

//   describe('GET /v1/api/files/:type', () => {
//     it('should fetch files successfully', async () => {
//       const response = await request(app)
//         .get('/v1/api/files/image?page=1&limit=10')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('result');
//       expect(response.body).toHaveProperty('pagination');
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).get(
//         '/v1/api/files/all?page=1&limit=10',
//       );

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('GET /v1/api/files/count', () => {
//     it('should return file counts', async () => {
//       const response = await request(app)
//         .get('/v1/api/files/count')
//         .set('Authorization', `Bearer ${token}`);

//       const body = response.body as IGetFileCountResponseDto;

//       expect(response.status).toBe(200);
//       expect(body.result).toHaveProperty('images');
//       expect(body.result).toHaveProperty('videos');
//       expect(body.result).toHaveProperty('document');
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).get('/v1/api/files/count');

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('DELETE /v1/api/files/:fileId', () => {
//     it('should return 404 for invalid file', async () => {
//       const response = await request(app)
//         .delete('/v1/api/files/999999')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).delete('/v1/api/files/999999');

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('GET /v1/api/files/:fileId/status', () => {
//     it('should return 404 when file does not exist', async () => {
//       const response = await request(app)
//         .get('/v1/api/files/999999/status')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).get(
//         '/v1/api/files/999999/status',
//       );

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('POST /v1/api/files/init', () => {
//     it('should reject non-video uploads', async () => {
//       const response = await request(app)
//         .post('/v1/api/files/init')
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           fileName: 'image.jpg',
//           mimeType: 'image/jpeg',
//         });

//       expect(response.status).toBe(400);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app)
//         .post('/v1/api/files/init')
//         .send({
//           fileName: 'video.mp4',
//           mimeType: 'video/mp4',
//         });

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('PUT /v1/api/files/:fileId/:processingId/:partNumber', () => {
//     it('should return 400 for invalid processing id', async () => {
//       const response = await request(app)
//         .put('/v1/api/files/1/999999/1')
//         .set('Authorization', `Bearer ${token}`)
//         .set('Content-Type', 'application/octet-stream')
//         .send(Buffer.from('test'));

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app)
//         .put('/v1/api/files/1/999999/1')
//         .set('Content-Type', 'application/octet-stream')
//         .send(Buffer.from('test'));

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('POST /v1/api/files/:fileId/:processingId/complete', () => {
//     it('should return 404 for invalid processing id', async () => {
//       const response = await request(app)
//         .post('/v1/api/files/1/999999/complete')
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           parts: [],
//         });

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app)
//         .post('/v1/api/files/1/999999/complete')
//         .send({
//           parts: [],
//         });

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('GET /v1/api/files/:fileId/download/file', () => {
//     it('should return 404 for invalid file', async () => {
//       const response = await request(app)
//         .get('/v1/api/files/999999/download/file')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).get(
//         '/v1/api/files/999999/download/file',
//       );

//       expect(response.status).toBe(401);
//     });
//   });

//   describe('GET /v1/api/files/:fileId/:quality/download/video', () => {
//     it('should return 404 for invalid video', async () => {
//       const response = await request(app)
//         .get('/v1/api/files/999999/720p/download/video')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(404);
//     });

//     it('should return 401 without token', async () => {
//       const response = await request(app).get(
//         '/v1/api/files/999999/720p/download/video',
//       );

//       expect(response.status).toBe(401);
//     });
//   });
// });