import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Picture } from './entities/picture.entity';


@ApiTags('Картинки')
@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @ApiOperation({summary: 'Генерирование картинки'})
  @ApiResponse({status:200, type: Picture})
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPictureDto: CreatePictureDto, @Req() req) {
    return this.picturesService.create(createPictureDto, +req.user.id)
  }

  @ApiOperation({summary: 'Получить статус генерации'})
  @ApiResponse({status: 200, description: 'Получение статуса генерации'})
  @Get('status/:id')
  @UseGuards(JwtAuthGuard)
  getStatusGeneration(@Param('id') pictureId: string){
    return this.picturesService.getStatus(+pictureId)
  }

  @ApiOperation({summary: 'Получить все картинки'})
  @ApiResponse({status: 200, description: 'Получение всех картинок'})
  @Get('all')
  @UseGuards(JwtAuthGuard)
  getAll(){
    return this.picturesService.getAll()
  }
 
  @ApiOperation({summary: 'Лайкнуть/дислайкнуть картинку'})
  @ApiResponse({status: 200, description: 'Получение картинки с лайками'})
  @Post(':id')
  @UseGuards(JwtAuthGuard)
  likePicture(@Param('id') pictureId: string, @Req() req){
    console.log(req.user.id)
    return this.picturesService.likePicture(+req.user.id, +pictureId)
  }

  @ApiOperation({summary: 'Получить 3 самые популярные картинки'})
  @ApiResponse({status: 200, description: 'Получение 3 самых популярных картинок'})
  @Get('popular')
  @UseGuards(JwtAuthGuard)
  findMostPopular(){
    return this.picturesService.findMostPopular()
  }

}
