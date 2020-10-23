import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  action: string;
}
