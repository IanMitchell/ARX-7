# ARX-7

A dumb IRC bot that wishes it had a Lambda Drive.

## Commands

The bot comes with some standard commands, including choose, eightball, order, reply, and twitter modules. Some channels will also be able to access Showtimes information (these commands are fairly specialized).

## Setup

You'll need Node v6.4+ installed. Download the repo and run `$ npm install`.

Modify the `config.json` file as desired. If no plugins are listed for a channel, the channel loads every command available.

Some command require specific keys. Create a `.env` file in the directory with the following contents:

```
PASSWORDCHANNELNAME=channelpassword
ARX7_PASS=nspassword
SHOWTIMES_SERVER=https://urlhere.com
SHOWTIMES_KEY=showtimeskey
TWITTER_CONSUMER=token
TWITTER_CONSUMER_SECRET=secrettoken
TWITTER_ACCESS_TOKEN=accesstoken
TWITTER_ACCESS_TOKEN_SECRET=tokensecret
```

Once done, you can start the bot by running

```
$ npm start
```

Docker instructions further down.

### Using Docker

Create the `config.json` file, then build and run the image:

```
docker build -t arx-7 .
docker run --rm -ti arx-7
```

## Discussion

We hang in `#arx-7` on Rizon
