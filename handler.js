'use strict'

// ここを編集してね！
const feedUrl = 'https://aws.amazon.com/jp/blogs/news/feed'
const slackUrl = 'https://hooks.slack.com/services/dummy/dummy/dummy'
const slackChannel = '#notification'
// ここまで！

const request = require('request')
const feedParser = require('feedParser');
const moment = require('moment');
const url = require('url');
const parser = new feedParser();
const feedOptions = { url: feedUrl };

const notifySlack = (message, callback) => {
  const options = {
    uri: slackUrl,
    headers: { "Content-type": "application/json", },
    json: message,
    channel: slackChannel,
  }
  request.post(options, (error, response, body) => {
    notifySender(callback)
  });
}

const notifySender = (callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ status: 'ok' })
  };
  callback(null, response);
}

const itemsToSlackMessage = (meta, items) => {
  const attachments = items.map((item) => {
    const date = moment(item.pubDate).format("YYYY/MM/DD HH:mm:ss ddd");
    const description = item["rss:description"]["#"]
    return {
      title: item.title,
      title_link: item.link,
      text: description.slice(0, 100) + "...",
      author_name: `${item.author} - ${date}`
    }
  });
  return {
    attachments: attachments,
    username: meta.title
  }
}

module.exports.feedToSlack = (event, context, callback) => {
  const req = request(feedOptions.url);
  var item;
  var items = [];

  req.on('response', function (res) {
      const stream = this;
      if (res.statusCode != 200) {
          return stream.emit('error', new Error('Bad status code'));
      }
      stream.pipe(parser);
  });

  parser.on('readable', function() {
    while(item = this.read()) {
      items.push(item);
    }
  });

  parser.on('end', function() {
    const meta = this.meta;
    const message = itemsToSlackMessage(meta, items);
    notifySlack(message, callback);
  });
}
