import { Injectable, NotFoundException , UseGuards} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Injectable()
@UseGuards(JwtAuthGuard)
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...rest } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create( {...rest, password: hashedPassword});
    return await this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['borrowedBooks'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserInput: CreateUserInput): Promise<User> {
    await this.userRepository.update(id, updateUserInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    // return user;
    return { ...user, id };
  }
}
