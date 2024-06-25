// borrow.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BorrowService } from './borrow.service';
import { UseGuards } from '@nestjs/common';
import { Borrow } from './borrow.entity';
import { CreateBorrowInput } from './dto/create-borrow.input';
import { UpdateBorrowInput } from './dto/update-borrow.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Borrow)
export class BorrowResolver {
  constructor(private readonly borrowService: BorrowService) {}

  @Mutation(() => Borrow)
  @UseGuards(JwtAuthGuard)
  createBorrow(@Args('createBorrowInput') createBorrowInput: CreateBorrowInput) {
    return this.borrowService.create(createBorrowInput);
  }

  @Query(() => [Borrow], { name: 'borrows' })
  findAll() {
    return this.borrowService.findAll();
  }

  @Query(() => Borrow, { name: 'borrow' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.borrowService.findOne(id);
  }

  @Mutation(() => Borrow)
  @UseGuards(JwtAuthGuard)
  updateBorrow(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBorrowInput') updateBorrowInput: UpdateBorrowInput,
  ) {
    return this.borrowService.update(id, updateBorrowInput);
  }

  @Mutation(() => Borrow)
  @UseGuards(JwtAuthGuard)
  removeBorrow(@Args('id', { type: () => Int }) id: number) {
    return this.borrowService.remove(id);
  }
}
