import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {config} from "../../config";

@Injectable()
export class UploadService {
    public upload(file: string) {
        const fileToBeUploaded = Buffer.from(file.split(',')[1], 'base64');
        const name = Math.floor((Math.random() * 1000000000) + 1) + '.jpeg';

        const date: Date = new Date();

        const folderPath = `/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        const path = `${config.upload.save_path}/${folderPath}`;

        this.createDir(path, 770);
        fs.writeFileSync(path + '/' + name, fileToBeUploaded);

        return config.upload.domain + config.upload.url_path + folderPath + '/' + name;
    }

    public uploadJs(user: number, domain: string, file: string) {
        const fileToBeUploaded = Buffer.from(file);
        const name = `linvo.${user}.js`;

        const folderPath = `/user-scripts/${domain}`;
        const path = `${config.upload.save_path}${folderPath}`;

        this.createDir(path, 770);
        fs.writeFileSync(path + '/' + name, fileToBeUploaded);

        return config.upload.domain + config.upload.url_path + folderPath + '/' + name;
    }

    private createDir(dir, mode) {
        // This will create a dir given a path such as './folder/subfolder'
        const splitPath = dir.split('/');
        splitPath.reduce((path, subPath) => {
            let currentPath;
            if (subPath !== '.') {
                currentPath = path + '/' + subPath;
                if (!fs.existsSync(currentPath)) {
                    fs.mkdirSync(currentPath, '0' + String(mode));
                }
            }
            else{
                currentPath = subPath;
            }
            return currentPath;
        }, '');
    }
}
