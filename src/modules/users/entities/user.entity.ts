import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { unique: true })
  name: string;

  @Column('bool', { default: true })
  isActive: boolean;
}
