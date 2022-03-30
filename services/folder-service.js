const fs = require('fs');
const path = require('path');
const FileService = require('./file-service');
const detectCharacterEncoding = require('detect-character-encoding');

class FolderService {
    vueFiles = [];
    ignoreList = ['node_modules'];
    fileService = new FileService();

    async fileExists(file) {
        return new Promise((res) => {
            fs.access(file, fs.constants.F_OK, (err) => {
                res(!err);
            });
        })
    }

    async getAllFiles(folderPath, callback) {
        if (!await this.fileExists(folderPath)) {
            throw new Error(`${folderPath} does not exist`);
        }

        if (this.ignoreList.some(ignorePattern => new RegExp(ignorePattern).test(folderPath))) {
            return;
        }

        const dirFiles = fs.readdirSync(folderPath, {withFileTypes: true});

        await Promise.all(dirFiles.map(async (file) => {
            const filesPath = `${folderPath}/${file.name}`;

            if (file.isDirectory()) {
                await this.getAllFiles(filesPath, callback);
            } else {
                await callback(folderPath, file);
            }
        }));
    }

    async addVueFiles(folderPath, file) {
        const component = this.fileService.getComponentName(file.name);
        const files = await this.fileService.findSplitVueFiles(folderPath, component);

        if (files) {
            const componentData = {
                files,
                component,
                linesCount: await this.fileService.getLinesCount(files),
            };

            this.vueFiles.push(componentData);
        }
    }

    moveFilesHigherLvl(files, folderPath) {
        return Promise.all(files.map(async file => {
            const oldPath = `${folderPath}/${file}`;
            const newPath = `${path.join('..', folderPath)}/${file}`;

            if (await this.fileExists(newPath)) {
                console.log('SHOULD DO SMTH WITH DUPLICATION OF FILES');
            } else {
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err;
                    console.log('Successfully renamed - AKA moved!');
                })
            }
        }));
    }
}

module.exports = FolderService;
