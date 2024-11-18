import { ApiProperty } from "@nestjs/swagger"
import { Picture } from "src/pictures/entities/picture.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from "typeorm"


@Entity()
export class User {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: 'user@gmail.com', description: 'Почта'})
    @Column()
    email: string

    @ApiProperty({example: 123, description: 'Пароль'})
    @Column()
    password: string

    @ApiProperty({example: false, description: 'Статус премиума'})
    @Column({
        default: false
    })
    hasPremium: boolean

    @OneToMany(() => Picture, (picture) => picture.user, { onDelete: 'CASCADE' })
    picture: Picture[]
}
