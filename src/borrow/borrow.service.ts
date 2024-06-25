import { Injectable, NotFoundException , UseGuards} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from './borrow.entity';
import { CreateBorrowInput } from './dto/create-borrow.input';
import { User } from '../user/user.entity';
import { Book } from '../book/book.entity';
import { UpdateBorrowInput } from './dto/update-borrow.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepository: Repository<Borrow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBorrowInput: CreateBorrowInput): Promise<Borrow> {
    const { userId, bookId, borrowedAt } = createBorrowInput;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }
    const borrow = this.borrowRepository.create({
      user,
      book,
      borrowedAt,
    });
    return this.borrowRepository.save(borrow);
  }

  findAll(): Promise<Borrow[]> {
    return this.borrowRepository.find({ relations: ['user', 'book'] });
  }

  async findOne(id: number): Promise<Borrow> {
    const borrow = await this.borrowRepository.findOneBy({ id });
    if (!borrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }
    return borrow;
  }

  async update(id: number, updateBorrowInput: UpdateBorrowInput): Promise<Borrow> {
    const borrow = await this.findOne(id);
    const { userId, bookId, borrowedAt ,returnedAt} = updateBorrowInput;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }
    borrow.user = user;
    borrow.book = book;
    borrow.borrowedAt = borrowedAt;
    borrow.returnedAt = returnedAt;
    return this.borrowRepository.save(borrow);
  }

  async remove(id: number): Promise<Borrow> {
    const borrow = await this.findOne(id);
    await this.borrowRepository.remove(borrow);
    return borrow;
  }
}
