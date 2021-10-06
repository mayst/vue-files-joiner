const { RED } = require('./constants/log-colors');
const StatisticsService = require('./services/statistics-service');
const watchPath = process.argv[2];

console.log(RED(`watchPath: ${watchPath}`));

const statisticsService = new StatisticsService(watchPath);
statisticsService.makeStatistics();
