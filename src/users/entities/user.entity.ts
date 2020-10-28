import { Secretary } from '../../secretaries/entities/secretary.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Profile } from '../../profiles/entities/profile.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Place } from 'src/places/entities/place.entity';

@Entity()
@Unique(['document'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  document: string;

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

  @Column({ nullable: true, default: null })
  patientId: string;

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

  @OneToOne(
    () => Patient,
    patient => patient.user,
  )
  @JoinColumn({ name: 'patientId' })
  patient?: Patient;

  @ManyToMany(
    () => Patient,
    patient => patient.users,
  )
  patients: Patient[];

  @ManyToMany(
    () => Place,
    place => place.users,
  )
  places: Place[];
}
