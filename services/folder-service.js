const fs = require('fs');
const FileService = require('./file-service');

class FolderService {
    vueFiles = [];
    ignoreList = ['node_modules'];
    fileService = new FileService();

    async getAllFiles(folderPath) {
        if (!fs.existsSync(folderPath)) {
            throw new Error('Can`t find needed folder.');
        }

        if (this.ignoreList.some(ignorePattern => new RegExp(ignorePattern).test(folderPath))) {
            return;
        }

        const dirFiles = fs.readdirSync(folderPath, {withFileTypes: true});

        await Promise.all(dirFiles.map(async (file) => {
            const filesPath = `${folderPath}/${file.name}`;

            if (file.isDirectory()) {
                await this.getAllFiles(filesPath);
            } else if (this.fileService.isVueFile(file.name)) {
                await this.addVueFiles(folderPath, file);
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
}

module.exports = FolderService;
