const { RED } = require('../constants/log-colors');
const JoinService = require('../services/join-service');
const joinPath = process.argv[2];

console.log(RED(`join path: ${joinPath}`));

const joinService = new JoinService(joinPath);
joinService.joinFiles();
