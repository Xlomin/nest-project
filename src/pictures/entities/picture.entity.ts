import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/users/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm"


export enum StatusGeneration {
    GENERATED = "generated",
    COMPLETED = "completed",
    ERROR = "error"
}

@Entity()
export class Picture {
    
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: 'Magic cat', description: 'Запрос по которому будет генерироваться картинка'})
    @Column()
    request: string

    @ApiProperty({example: '123kit.jpg', description: 'Название картинки'})
    @Column()
    picture: string 

    @ApiProperty({example: 'generated', description: 'Статус генерации картинки'})
    @Column({
        type: "enum",
        enum: StatusGeneration,
        default: StatusGeneration.GENERATED
    })
    status: string

    @ManyToOne(() => User, (user) => user.picture)
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToMany(() => User)
    @JoinTable({ name: 'picture_liked_user' })
    usersLiked: User[]
}
