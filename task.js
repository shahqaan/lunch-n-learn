const Utils = require('./utils');
const Slack = require('slack-node');
let list = require('./list.json');

let slack = new Slack();
slack.setWebhook('https://onebyte.slack.com/');

slack.webhook({
  channel: "#test",
  username: "lunch-n-learn",
  text: `Coming Lunch & Learn: ${list.current}`
}, function(err, response) {
  console.log(response);
});


// Utils.move().then(list => console.log(list));
