import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from './entities/picture.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PicturesService {

  constructor(
    @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
    @InjectQueue('generateFile') private readonly generateFile: Queue,
    private fileService: FilesService,
    private userService: UsersService
  ) {}

  async create(createPictureDto: CreatePictureDto, id: number) {
    await this.generateFile.add('generatePicture',
      {
        request: createPictureDto.request,
        id
      },
      {
        repeat:{
          every: 60000,
          limit: 3
        }      
      }
    )
  }

  async getStatus(pictureId: number){
    const picture = this.findById(pictureId)

    if(!picture) throw new NotFoundException('Picutre is not exist')

    return (await picture).status
  }

  async getAll() {
    let picture = await this.findAll()

    picture = picture.sort(function(a, b){
      return a.id - b.id
    })

    return picture
  }

  async update(id: number, updatePictureDto: UpdatePictureDto){
    return await this.pictureRepository.update(id, updatePictureDto)
  }

  async findById(id: number){
    return await this.pictureRepository.findOne({
      where: { id },
      relations: { usersLiked: true }
    })
  }

  async findAll(){
    return await this.pictureRepository.find({
      relations:{
        usersLiked: true
      }
    })
    
  }

  async likePicture(userId: number, pictureId: number){
    console.log(userId)
    console.log(pictureId)
    const picture = await this.findById(pictureId)
    const currentUser = await this.userService.findById(userId)
    const existLike = await this.pictureRepository.findOne({
      where:{
        id: pictureId,
        usersLiked: currentUser
      }
    })

    if(existLike) {
      picture.usersLiked = picture.usersLiked.filter((user) => {
        return user.id !== currentUser.id
      })
    } else {
      picture.usersLiked.push(currentUser)
    }

    return await this.pictureRepository.save(picture)
  }

  async findMostPopular(){
    
    let pictures = await this.findAll()

    pictures = pictures.sort(function(a, b){
      return b.usersLiked.length - a.usersLiked.length
    })

    return pictures.slice(0, 3)
  }
}
