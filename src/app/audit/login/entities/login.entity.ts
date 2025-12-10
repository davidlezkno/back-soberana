import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoginAudit {
  // This is the primary key for the Set model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column
  @Column()
  username: string;

  // This a column
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loginDate: Date;
}

