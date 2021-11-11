const schedule = require('node-schedule');
const icloudHelper = require('./src/icloud/icloud-agent');
global._taskOnRun = false;

schedule.scheduleJob('*/1 * * * *', async function () {
  if (!global._taskOnRun) {
    console.info('Task start');
    const cloud = new icloudHelper();
    await cloud.cloudTask();
  } else {
    console.info('Task busy');
  }
});
