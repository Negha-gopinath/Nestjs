
import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  create(createBookInput: CreateBookInput): Promise<Book> {
    const book = this.bookRepository.create(createBookInput);
    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookInput: CreateBookInput): Promise<Book> {
    await this.bookRepository.update(id, updateBookInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    // return book;
    return { ...book, id };
  }
}
