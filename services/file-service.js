const fs = require("fs");

class FileService {
    getComponentName(file) {
        return file.replace('.vue', '');
    }

    isVueFile(folderName) {
        return /.vue$/.test(folderName);
    }

    async findSplitVueFiles(folder, component) {
        const files = fs.readdirSync(folder);
        const fileTs = `${component}.ts`;
        const fileHTml = `${component}.html`;
        const fileSass = `${component}.scss`;

        if (files.includes(fileTs) && files.includes(fileHTml)) {
            const componentFiles = [`${folder}/${component}.vue`, `${folder}/${fileTs}`, `${folder}/${fileHTml}`];

            if (files.includes(fileSass)) {
                const sassPath = `${folder}/${fileSass}`;
                const sassLines = await this.getLinesCount(sassPath);

                if (sassLines < 100) {
                    componentFiles.push(sassPath);
                }
            }

            return componentFiles;
        }
    }

    async getLinesCount(files) {
        const normalizedFiles = Array.isArray(files) ? files : [files];

        const countList = await Promise.all(normalizedFiles.map(file => {
            return new Promise((res, rej) => {
                let linesCount = 0;

                fs.createReadStream(file)
                    .on('error', e => rej(e))
                    .on('open', () => {
                        if (/(.ts|.sass)$/.test(file)) {
                            // add an empty line
                            linesCount++;
                        }

                        // for wrapping tags
                        linesCount += 2;
                    })
                    .on('data', chunk => {
                        for (let i = 0; i < chunk.length; ++i) {
                            if (chunk[i] == 10) {
                                linesCount++;
                            }
                        }
                    })
                    .on('close', () => {
                        res(linesCount);
                    });
            });
        }));

        return countList.reduce((sum, count) => sum += count, 0);
    }
}

module.exports = FileService;
