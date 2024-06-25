import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Book } from '../book/book.entity';

@ObjectType()
@Entity()
export class Borrow {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  borrowedAt: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  returnedAt: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.borrowedBooks, { eager: true })
  user: User;

  @Field(() => Book)
  @ManyToOne(() => Book, { eager: true })
  book: Book;
}
