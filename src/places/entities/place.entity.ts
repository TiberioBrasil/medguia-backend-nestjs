import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['placeId'])
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  placeId: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;

  @ManyToMany(
    () => User,
    user => user.places,
  )
  @JoinTable()
  users: User[];
}
