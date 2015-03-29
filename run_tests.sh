# export test environment variables
SLASHBOT_WEBHOOK_URL=http://slackwebhook.com/webhook SLASHBOT_TOKENS=slashbot:slashbotToken DEBUG=slashbot:* mocha --recursive --reporter spec test/
