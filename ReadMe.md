# ARX-7

A dumb IRC bot that wishes it had a Lambda Drive.

## Commands

1. **Choose Command:** When a user types `.c <list>` as a message, ARX-7 will try to randomly select an entry in `<list>`. The following formats are recognized:
  * `1-100`: When given a range in this format, a random number within the given range is chosen and returned.
  * `0-1.0`: When given a decimal range in a similar format, a random number to the highest level of decimal points passed in as part of the range will be returned. For instance, `.c 0-1.0` could return `0.8`, while `1.000-3.37` could return `2.862`.
  * `a list, of different, phrases`: When commas are present, ARX-7 will treat them as delimiters
  * `a list of words`: When there are no commas present, ARX-7 will use spaces as delimiters
2. **Order Command:** When a user types `.o <list>` as a message, ARX-7 will try to order the contents of `<list>`. The following formats are recognized:
  * `1-100`: When given a range in this format, up to twenty random numbers are chosen and returned.
  * `a list, of different, phrases`: When commas are present, ARX-7 will treat them as delimiters
  * `a list of words`: When there are no commas present, ARX-7 will use spaces as delimiters
3. **YouTube Command:** When a user types `.yt <search string>` as a message, ARX-7 will search YouTube and return the first video it finds with the corresponding `<search string>`.
4. **YouTube Link Recognition:** When a YouTube link is in a message, ARX-7 will automatically grab some information such as movie title and total views to display in a message.
5. **Tweet Link Recognition:** When a Twitter link is in a message, ARX-7 will automatically grab some information such as tweet contents, username, and display name to display in a message.
6. **Imgur Link Recognition:** When a Imgur link is in a message, ARX-7 will automatically grab some information such as title and total views to display in a message.
7. **Debug Responses:** Although only one is needed, a few silly phrases are present for debug reasons:
  * `Ping`: ARX-7 will respond with `pong`
  * `bot respond`: ARX-7 will respond with `I'm a pretty stupid bot.`
  * `bot be nice`: ARX-7 will respond with `sorry :(`
  * `gj bot`: ARX-7 will respond with `thx`

## Setup

```
$ npm install
$ npm app.js
```
You'll need to create a config file that looks like the following:

`config.json` file:

```
{
  "name": "ARX-7",
  "server": "irc.rizon.net",
  "password": "password",
  "channels": [
    "#arx-7"
  ],
  "keys": {
    "youtube": "key",
    "twitter_consumer": "key",
    "twitter_consumer_secret": "key",
    "twitter_access_token": "key",
    "twitter_access_token_secret": "key",
    "imgur_client": "key",
    "imgur_secret": "key"
  }
}

```

## Discussion

We hang in `#arx-7` on Rizon
