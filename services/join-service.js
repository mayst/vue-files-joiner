const fs = require("fs");
const path = require("path");
const {BLUE} = require("../constants/log-colors");
const FolderService = require("./folder-service");
const FileService = require("./file-service");

class JoinService {
    joinPath;
    folderService = new FolderService();
    fileService = new FileService();

    constructor(joinPath) {
        this.joinPath = joinPath;
    }

    async getFilesCallback(folderPath, file) {
        if (this.fileService.isVueFile(file.name)) {
            await this.folderService.addVueFiles(folderPath, file);

            const dirFiles = fs.readdirSync(folderPath);
            const component = this.fileService.getComponentName(file.name);
            const notComponentFiles = dirFiles.filter(file => !(new RegExp(component).test(file)));

            if (notComponentFiles > 0) {
                await this.folderService.moveFilesHigherLvl(notComponentFiles, folderPath);
            }
        }
    }

    async joinFiles() {
        await this.folderService.getAllFiles(this.joinPath, this.getFilesCallback.bind(this));

        console.log(BLUE('COMPONENTS TOTAL COUNT:', this.folderService.vueFiles.length));

        this.folderService.vueFiles.forEach(vueFiles => this.makeSFC(vueFiles));
    }

    async makeSFC({ files, component }) {
        const filePath = path.join(files[0], '..', '..', `${component}.vue`);
        const wStream = fs.createWriteStream(path.join('..', `${component}.vue`));
        // console.log('filePath', path.join(files[0], '..'), filePath);

        // return;

        await fs.promises.writeFile(filePath, '<template>');
        await this.addEmptyLine(filePath);
        // await this.addTabSpace(filePath);
        // await fs.promises.appendFile(filePath, );
        const htmlFile = files.find(file => /\.html$/.test(file));
        await this.appendHtmlFile(filePath, htmlFile);
        await fs.promises.appendFile(filePath, '</template>');
        await this.addEmptyLine(filePath);

        await this.addEmptyLine(filePath);
        await fs.promises.appendFile(filePath, '<script lang="ts">\n');
        const tsFile = files.find(file => /\.ts$/.test(file));
        await this.appendFile(filePath, tsFile);
        await fs.promises.appendFile(filePath, '</script>');
        await this.addEmptyLine(filePath);

        await this.addEmptyLine(filePath);
        const sassFile = files.find(file => /\.scss$/.test(file));
        if (sassFile) {
            await fs.promises.appendFile(filePath, '<style lang="scss">\n');
            await this.appendFile(filePath, sassFile);
            await fs.promises.appendFile(filePath, '</style>');
            await this.addEmptyLine(filePath);
        }
        // vueFiles
    }

    async addEmptyLine(filePath) {
        await fs.promises.appendFile(filePath, '\n');
    }

    async addTabSpace(filePath) {
        await fs.promises.appendFile(filePath, '\t');
    }

    appendHtmlFile(filePath, file) {
        return this.appendFile(filePath, file, async (filePath, chunk) => {
            const content = chunk.toString().replace(/^./gm, (match) => {
                console.log('FOUND', match);
                return `\t${match}`;
            });

            await fs.promises.appendFile(filePath, content);
        });
    }

    appendFile(filePath, file, cb = (filePath, chunk) => fs.promises.appendFile(filePath, chunk)) {
        return new Promise((res, rej) => {
            fs.createReadStream(file)
                .on('error', e => rej(e))
                .on('open', () => {
                    console.log('OPEN READ', file)
                })
                .on('data', async chunk => {
                    console.log('APPEND TO', filePath);
                    await cb(filePath, chunk);
                })
                .on('close', () => {
                    console.log('APPEND FILE ENDED', file);
                    res();
                });
        });
    }
}

module.exports = JoinService;
