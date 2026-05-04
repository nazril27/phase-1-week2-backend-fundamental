const moment = require('moment');

function scheduleTask() {
  const now = moment();

  const addThreeDays = now.clone().add(3, "days");
  const date = addThreeDays.format("dddd, DD MMMM YYYY");
  const time = now.format("hh:mm A");

  console.log(`Scheduled task for: ${date} ${time}`);
}

module.exports = { scheduleTask };