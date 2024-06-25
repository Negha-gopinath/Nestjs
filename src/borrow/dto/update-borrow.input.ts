import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateBorrowInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  bookId: number;

  @Field()
  borrowedAt: string;

  @Field()
  returnedAt: string;
}
