const FolderService = require('./folder-service');
const {BLUE, YELLOW} = require("../constants/log-colors");

class StatisticsService {
    watchPath;
    folderService = new FolderService();
    ranges = [[0, 100], [101, 150], [151, 200], [201, 250], [251, 300], [301, 10000]];

    constructor(watchPath) {
        this.watchPath = watchPath;
    }

    async makeStatistics() {
        await this.folderService.getAllFiles(this.watchPath);

        console.log(BLUE('COMPONENTS TOTAL COUNT:', this.folderService.vueFiles.length));

        const statistics = this.splitBySize(...this.ranges);
        this.logResult(statistics);
    }

    logResult(statistics) {
        statistics.forEach(({length}, range) => {
            console.log(YELLOW(`LINES RANGE: [${range[0]}-${range[1]}]`));
            console.log('components count:', length);
        });
    }

    splitBySize(...ranges) {
        return ranges.reduce((stats, range, i) => {
            const items = this.folderService.vueFiles.filter(({linesCount}) => linesCount >= range[0] && linesCount <= range[1]);
            stats.set(ranges[i], items);

            return stats;
        }, new Map());
    }
}

module.exports = StatisticsService;
