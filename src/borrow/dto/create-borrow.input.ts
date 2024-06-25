import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBorrowInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  bookId: number;

  @Field()
  borrowedAt: string;
}
