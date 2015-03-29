# export test environment variables
SLASHBOT_WEBHOOK_URL=http://slackwebhook.com/webhook SLASHBOT_TOKENS=slashbot:mytoken DEBUG=slashbot:* mocha --recursive --reporter spec --check-leaks test/
