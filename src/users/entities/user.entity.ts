import { Profile } from '../../profiles/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Secretary } from 'src/secretaries/entities/secretary.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: null })
  recoverPassword: string;

  @Column({ nullable: true, default: null })
  profileId: number;

  @Column({ nullable: true, default: null })
  doctorId: string;

  @Column({ nullable: true, default: null })
  secretaryId: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(
    () => Profile,
    profile => profile.users,
  )
  @JoinColumn({ name: 'profileId' })
  profile?: Profile;

  @OneToOne(
    () => Doctor,
    doctor => doctor.user,
  )
  @JoinColumn({ name: 'doctorId' })
  doctor?: Doctor;

  @OneToOne(
    () => Secretary,
    secretary => secretary.user,
  )
  @JoinColumn({ name: 'secretaryId' })
  secretary?: Secretary;
}
