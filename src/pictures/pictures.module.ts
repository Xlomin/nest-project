import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { Picture } from './entities/picture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { GeneratePicture } from './picture.process';

@Module({
  controllers: [PicturesController],
  providers: [PicturesService, GeneratePicture],
  imports: [
    TypeOrmModule.forFeature([Picture]),
    BullModule.registerQueue({
      name: 'generateFile'  
    }),
    FilesModule,
    UsersModule
  ],
  exports: [PicturesService]
})
export class PicturesModule {}
