import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePictureDto {

    @ApiProperty({example: 'Magic cat', description: 'Запрос по которому будет генерироваться картинка'})
    @IsNotEmpty()
    request: string
}
