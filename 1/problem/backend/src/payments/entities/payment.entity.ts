import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_payments_idempotency_key", ["idempotencyKey"], {
    unique: true,
})
@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id!: string


    @Column({ type: "varchar" })
    orderId!: string

    @Column({ type: "decimal" })
    amount!: number

    @Column({ type: "varchar" })
    currency!: string

    @Column({ type: "uuid" })
    idempotencyKey!: string
}