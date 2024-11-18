import { OnQueueActive, OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { Picture, StatusGeneration } from "./entities/picture.entity";
import { FilesService } from "src/files/files.service";
import { Repository } from "typeorm";
import { promisify } from "util";
const sleep = promisify(setTimeout)


@Processor('generateFile')
export class GeneratePicture {

    constructor(
        @InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
        private fileService: FilesService
    ) {}
    
    @Process('generatePicture')
    async handleGeneratePicture(job: Job) {
        const { request, id } = job.data

        const picture = {
            request,
            picture: "",
            status: StatusGeneration.GENERATED,
            user: { id },
        }
        await this.pictureRepository.save(picture)

        await sleep(59000)

        try{
            const file = await this.fileService.createFile()
            const pictureName = await this.fileService.saveFile(file)
        
            picture.picture = pictureName
            picture.status = StatusGeneration.COMPLETED
    
            await this.pictureRepository.save(picture)

        } catch(e){
            picture.status = StatusGeneration.ERROR
            await this.pictureRepository.save(picture)
        }
    }


    @OnQueueActive()
    onActive(job: Job){
        console.log('Processing job ' + job.id + ' of type ' + job.name + ' with data ' + job.data.request)
    }

    @OnQueueCompleted()
    onCompleted(job: Job){
        console.log('Job with ' + job.id + ' completed')
    }
}

