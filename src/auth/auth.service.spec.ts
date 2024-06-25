import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User;

      userRepository.findOneBy = jest.fn().mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null if validation fails', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { email: 'test@example.com', id: 1 } as User;
      jwtService.sign = jest.fn().mockReturnValue('token');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('register', () => {
    it('should create a new user and return an access token', async () => {
      const user = { email: 'test@example.com', password: 'password' } as User;
      const savedUser = { ...user, id: 1, password: 'hashedPassword' } as User;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      userRepository.create = jest.fn().mockReturnValue(savedUser);
      userRepository.save = jest.fn().mockResolvedValue(savedUser);
      jwtService.sign = jest.fn().mockReturnValue('token');

      const result = await authService.register(user);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
