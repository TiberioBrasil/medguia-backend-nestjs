import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Action } from '../../actions/entities/action.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @OneToMany(
    () => User,
    auth => auth.profile,
    { lazy: true, eager: false },
  )
  users: Promise<User[]>;

  @ManyToMany(() => Action)
  @JoinTable()
  actions: Action[];
}
