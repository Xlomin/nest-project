import { ApiProperty } from "@nestjs/swagger"
import { IsEmail } from "class-validator"

export class CreateUserDto {
    
    @ApiProperty({example: 'user@gmail.com', description: 'Почта'})
    @IsEmail()
    email: string

    @ApiProperty({example: 123, description: 'Пароль'})
    password: string
}
