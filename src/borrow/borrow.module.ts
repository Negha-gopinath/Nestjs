import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowService } from './borrow.service';
import { BorrowResolver } from './borrow.resolver';
import { Borrow } from './borrow.entity';
import { User } from '../user/user.entity';
import { Book } from '../book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, User, Book])],
  providers: [BorrowService, BorrowResolver],
})
export class BorrowModule {}
