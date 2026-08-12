import { jest } from '@jest/globals';

import type {
  ICreateUserRequestDto,
  ILoginRequestDto,
} from '../../../dto/request/auth-request-dto.js';

import type {
  ICreateUserResponseDto,
  ILoginResponseDto,
} from '../../../dto/response/auth-response-dto.js';


const loginService = jest.fn<
  (body: ILoginRequestDto) => Promise<ILoginResponseDto>
>();

const createUserService = jest.fn<
  (body: ICreateUserRequestDto) => Promise<ICreateUserResponseDto>
>();


jest.unstable_mockModule(
  '../../../service/index.js',
  () => ({
    default: {
      auth: {
        loginService,
        createUserService,
      },
    },
  }),
);


const { default: controller } =
  await import('../../../controller/index.js');


describe('Auth Controller', () => {

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('login', () => {

    it('should login successfully', async () => {

      const req = {
        body: {
          email: 'test@test.com',
          password: 'password',
        },
      };

      const response: ILoginResponseDto = {
        message: 'Login successful',
        token: 'test-token',
      };

      loginService.mockResolvedValue(response);


      await controller.AuthController.login(
        req as any,
        res as any,
        next,
      );


      expect(loginService).toHaveBeenCalledWith(
        req.body,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        response,
      );
    });


    it('should call next when login fails', async () => {

      const req = {
        body: {
          email: 'test@test.com',
          password: 'password',
        },
      };

      const error =
        new Error('Invalid credentials');

      loginService.mockRejectedValue(error);


      await controller.AuthController.login(
        req as any,
        res as any,
        next,
      );


      expect(next).toHaveBeenCalledWith(error);
    });

  });


  describe('createUser', () => {

    it('should create user successfully', async () => {

      const req = {
        body: {
          name: 'Test User',
          email: 'test@test.com',
          password: 'password',
        },
      };

      const response: ICreateUserResponseDto = {
        message: 'User registered successfully',
        result: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
        },
      };

      createUserService.mockResolvedValue(response);


      await controller.AuthController.createUser(
        req as any,
        res as any,
        next,
      );


      expect(createUserService).toHaveBeenCalledWith(
        req.body,
      );

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith(
        response,
      );
    });


    it('should call next when create user fails', async () => {

      const req = {
        body: {
          name: 'Test User',
          email: 'test@test.com',
          password: 'password',
        },
      };

      const error =
        new Error('User already exists');

      createUserService.mockRejectedValue(error);


      await controller.AuthController.createUser(
        req as any,
        res as any,
        next,
      );


      expect(next).toHaveBeenCalledWith(error);
    });

  });

});