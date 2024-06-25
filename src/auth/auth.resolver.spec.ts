import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const mockAuthService = () => ({
  login: jest.fn(),
  register: jest.fn(),
});

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useFactory: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginUserInput = { email: 'test@example.com', password: 'password' };
      const result = { access_token: 'token' };
      authService.login.mockResolvedValue(result);

      expect(await resolver.login(loginUserInput)).toEqual(result);
    });
  });

  describe('register', () => {
    it('should return an access token', async () => {
      const registerUserInput = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const result = { access_token: 'token' };
      authService.register.mockResolvedValue(result);

      expect(await resolver.register(registerUserInput)).toEqual(result);
    });
  });
});
