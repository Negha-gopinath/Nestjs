import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Book)
@UseGuards(JwtAuthGuard)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
   findAll() {
    return this.bookService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBookInput') updateBookInput: CreateBookInput,
  ) {
    return this.bookService.update(id, updateBookInput);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.remove(id);
  }
}
