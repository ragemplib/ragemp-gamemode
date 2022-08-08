import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn } from "typeorm";

@Entity('character')
class Character {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @CreateDateColumn()
  createdData: Date
}

export default Character
