## 必要なもの
https://serverless.com/

```
$ npm install -g serverless
```

## インストール
```
$ serverless install -u https://github.com/yudetamago/my_rss_to_slack_service
$ cd my_rss_to_slack_service
$ npm install
```

## 設定
- `handler.js` にある`slackUrl`と`slackChannel`を自分のものに変更
- `serverless.yml`にある`region`や`profile`を自分のものに変更

## デプロイ
```
$ serverless deploy
```

## ローカル実行
```
$ serverless invoke local -f feedToSlack
```

## AWS上で実行
```
$ serverless invoke -f feedToSlack
```
