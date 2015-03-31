# slashbot
A hubot-like chat bot for slack.

[![Build Status](https://img.shields.io/travis/jesseditson/slashbot.svg?style=flat-square)](https://travis-ci.org/jesseditson/slashbot)
[![Npm Version](https://img.shields.io/npm/v/slashbot.svg?style=flat-square)](https://npmjs.com/packages/slashbot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

##Basic Usage (how to set up your slashbot)
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

  ![Required Integrations](http://oi.pxfx.io/image/3F1l3m2a321r/slashbot-integrations.png)

  We'll talk more about slash commands later in this guide. For now, let's get a slashbot server running and talking to us.

- First, add your `bot` integration.

  When you add a new bot, you'll be first asked to name it.

  ![Bot Name](http://oi.pxfx.io/image/032P1O0F2l0y/Image%202015-03-29%20at%2012.33.17%20PM.png)

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

##Adding slash commands
----

We mentioned that we'd be adding slash commands to our bot earlier. Slash commands are cool because they automatically show up in the context menu when hitting `/`. Slash commands are better than responders for doing things that have business utility like `/deploy`, because they come with free documentation, and they are easy to remember (just hit `/`, and you'll see all your installed slash commands).

- For this example, we'll install a slash command to get an animated gif from google. Just like a listener, we can go to our repo and install it:

```shell
$ npm install --save slashbot-animate
```

- This will install an `/animate` route on our server, that slack will be able to hit with a slash command now.

- To enable a slash command, head back to your slack settings, and add a slash commands integration.

![New Command](http://oi.pxfx.io/image/1o2K0W3k0v47/Image%202015-03-29%20at%205.52.59%20PM.png)

- On the next page, there's a form. We'll want to get the token from this page, and start our server, whitelisting this token for the animate command:

```
$ DEBUG=slashbot* SLASHBOT_TOKENS=slashbot:bot-api-token,slashbot-animate:bot-animate-token SLASHBOT_WEBHOOK_URL=webook-url ./node_modules/slashbot/bin/server --name=slashbot --port=3000
```

The important part of the above line is: `SLASHBOT_TOKENS=slashbot:bot-api-token,slashbot-animate:bot-animate-token`. The `SLASHBOT_TOKENS` environment variable is where you will define all your whitelisted access tokens for different scripts. It is a comma separated list in the format of `key:value`. After you've started your server, we'll need to expose our local server to the web. I'll use [ngrok](https://ngrok.com/) to do this.

In a new terminal window (leave your slashbot server running), start up ngrok.

```shell
$ ngrok 3000
```

Ngrok will tell you where your server can be accessed (something like `http://djksjds.ngrok.com`). Copy this URL, and head back to your slack settings.

- Enter your ngrok url as the URL for this slash command. It'll look something like this when you're done:

![Slash URL](http://oi.pxfx.io/image/3S3A2Q3S3g0f/Image%202015-03-29%20at%206.00.29%20PM.png)

- Optionally, you can go down and expand the information on what this command does. This is where you can enable & configure what shows up inside of slack's autocomplete when a user types `/`.

- Once you've saved your integration, you'll be able to type `/animate something`, and the animate command will post an animated gif for you.

##Configuration
---

Slashbot has 2 configuration concepts: public configuration, which are things like the bot name, and private configuration, which are things like access tokens.

**Public configuration**

Public configuration is passed in to the bot when instantiating. If you look at [slashbot-example](https://github.com/jesseditson/slashbot-example), you'll see that the main file passes in a name. You can also pass in a default icon, which can be an :emoji: or a url.

Additionally, you can pass in some base configuration options:

• port - sets the server port
• responders - an array of files to require as responders. Use this to create your own responders.

A fully configured server would look like this:

```javascript
slashbot({
  name : 'slashbot',
  icon : ':ghost:',
  port : 3000,
  responders : [
    './responders/shout'
  ]
},function(err){
  if(err) throw err
  // your bot is now started.
})
```

**Private configuration**

Private configuration is all read from the environment. So locally, you'd configure your app like the above examples - just setting variables when starting the server.

In production, it will vary from system to system how you set these variables. This convention works very well though for systems like heroku which expect private variables to live in the environment.

The configurable variables are:

• SLASHBOT_TOKENS - required.

This environment variable is defined as a set of key-value pairs. keys and values are defined `name:token`, and separated by commas.

This must have at least 1 token, `slashbot`. This will be the token that you find in your `bot` integration on slack.

There must also be one token per slash command defined. The key is the name of the command (for instance, `slashbot-animate`), and the value is the token found in the slack configuration for that command.

• SLASHBOT_WEBHOOK_URL - required if using any slash commands

The webhook url that is available from the `incoming-webhooks` integration.

Because this package uses `debug`, you can turn on more verbose logging by specifying `DEBUG=slashbot*`.

##Deployment
---

// TODO: expand the docs on deployment

_(inside of the slashbot-example fork):_

```shell
$ heroku create myapp
$ heroku config:set SLASHBOT_TOKENS=whatever SLASHBOT_WEBHOOK_URL=whatever DEBUG=slashbot*
$ git push heroku
$ heroku ps:scale web=1
```

_update url in all slash commands_

##Custom responders
---

// TODO:
