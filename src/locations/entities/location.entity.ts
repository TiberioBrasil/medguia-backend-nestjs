import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['uf', 'name'])
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  uf: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;
}
