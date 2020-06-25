import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users", { schema: "linvoapp" })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", {  select: false, name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;
}
