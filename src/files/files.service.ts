import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { readFile, writeFile } from 'fs/promises';



@Injectable()
export class FilesService {


    groupFiles: any[]

    constructor() {
        this.groupFiles = [
            readFile('Pictures/kit.avif'),
            readFile('Pictures/rdtyt.avif'),
            readFile('Pictures/ugoi.avif'),
            readFile('Pictures/uyg.avif')
        ]
    }

    async createFile(){
        const randomNumber = Math.round(Math.random() * 4)
        const file = this.groupFiles[randomNumber]
        return file
    }

    async saveFile(file){
        try{
            const fileName = uuid.v4() + '.jpg'
            const filePath = path.resolve(__dirname, '..', 'static')

            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, {recursive: true})
            }

            fs.writeFileSync(path.join(filePath, fileName), file)

            return fileName
        } catch (e){
            throw new HttpException('Произошла ошибка при записи файла!', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
