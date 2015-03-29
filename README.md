# slashbot
A hubot-like chat bot for slack.

[![Build Status](https://travis-ci.org/jesseditson/slashbot.svg?branch=master)](https://travis-ci.org/jesseditson/slashbot)
[![Npm Version](https://npmjs.com/packages/slasbot)](https://img.shields.io/npm/v/npm.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

##How to set up a slashbot
-----

- Fork the [example repo](https://github.com/jesseditson/slashbot-example) (https://github.com/jesseditson/slashbot-example).

  this contains an example of a slashbot setup. The example requires this repository. All the docs are here, so probably star this one or whatever.

- Clone your shiny new slashbot.

```shell
$ git clone git@github.com:youruser/slashbot-example.git
$ cd slashbot-example
```

- Browse the [list of slashbot commands and listeners](TODO), maybe pick out one you like.

  installing a listener is simple. If it's on npm, just type `npm install --save <slashbot-command-name>` and slashbot will automatically add that command or listener.

- Cruise to your slack team integration settings (https://yourteam.slack.com/services).

  You'll need to add 3 integrations to unleash the full potential of slashbot:
  1. the `bots` integration - this is used for slashbot listeners, which can respond to any message in slack. For example, a bot could listen to any sentence beginning with `what is <thing>`, and respond to the user with a wolfram alpha explanation of the thing in question.
  2. the `incoming webhooks` integration. This is used by slashbot to post things to slack. It will mostly be used in conjunction with slashbot commands, and is a prerequisite to using any slashbot commands at all.
  3. the `slash commands` integration. This is used to add new slash commands to slack. When you type `/`, you see a list of commands slack provides by default. We can create our own (or use open source) slashbot commands and wire them up using this integration.

  ![Required Integrations](http://oi.pxfx.io/image/3F1l3m2a321r)

  We'll talk more about slash commands later in this guide. For now, let's get a slashbot server running and talking to us.

- First, add your `bot` integration.

  When you add a new bot, you'll be first asked to name it.

  ![Bot Name](http://oi.pxfx.io/image/032P1O0F2l0y)

  Then, you'll be taken to the bot settings. From here you can further customize the bot, but the main thing we need is the 'API Token'.
  Copy the api token - we'll refer to this as the `Bot API Token` from now on.

- Now, add your `incoming webhooks` integration.

  You'll be prompted to choose a channel for your webhook. This is just a default, so don't worry about which room it's in. Your bot will still be able to talk to any slack room. Select a random room and move on.

  There is a lot of info on this page. You don't have to read it - slashbot comes with a built-in `respond` method that will take care of abstracting this API for you. The one thing you will need is the `Webhook URL` - it's at the very top of this page. Copy it, and put it somewhere so we can also use it later.

- Head back to your repo, and install a slashbot listener:

```shell
$ npm install --save slashbot-clever
```

  this installs a cleverbot listener in your slashbot. This will make slashbot respond to you in natural language when directly addressed. It may not be a very useful listener, but it certainly gives your new slashbot some personality.

- To see this in action, all we have to do is start the server using our credentials. Head to your repo and run the following (replacing `bot-api-token` with your Bot API Token, and replacing `webhook-url` with your Webhook URL from above.):

```bash
$ DEBUG=slashbot* SLASHBOT_TOKENS=slashbot:bot-api-token SLASHBOT_WEBHOOK_URL=webook-url ./node_modules/slashbot/bin/server --name=slashbot --port=3000
```

Some of the options defined above (debug, name, port) are purely illustrative, but you can see that you could rename your bot if you liked, or change the port the server runs on.

Your debug log should tell you that it has started slashbot, and print out some useful info. Something like this:

![Bot Started](http://oi.pxfx.io/image/472F0Z162w0o/Image%202015-03-29%20at%204.42.42%20PM.png)

- Now that your bot is running, head over to your slack chat room and @message your new bot. You'll notice that the debug log will print out some info about the cleverbot transaction, and your bot should respond to you:

![Response](http://oi.pxfx.io/image/1s0W1e1a0s3l/Image%202015-03-29%20at%204.43.58%20PM.png)
