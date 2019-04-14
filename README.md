# Instabot

This project is a bot that acts on Instagram website to perform preconfigured actions.

It serves an educational purpose only and, as such, shouldn't be used for any other
purposes.

## Architecture

The project is composed of a server side and a client side.

### Client
The client is a React/TS/GraphQL app from which the user can consult the bot
statistics in real time and configure it.

Configuration is done by reading the `src/config/config.ts` file. See the
`src/config/config.ts.dist` file for more informations.

#### Commands
* `yarn start` : starts the client

### Server

The server project is divided into two processes :
* The bot, which runs `puppeteer` in order to crawl the Instagram website
* The HTTP server which communicates with the bot in order to collect informations about
the crawling process and allows to command it back. It runs `GraphQL.


Variable configuration is stored as a JSON file named `var/variables.json`. See the
`var/variables.default.json` file for more informations.

Configuration is done by reading the `config/config.ts` file. See the
`config/config.ts.dist` file for more informations.`

#### Commands
* `yarn start` : starts the server


## Authentication
As of now the HTTP server requires authentication in order to be able to get data from it
or command the bot. 

The current authentication mechanism simply rely on a permanent token stored in
`server/config/config.ts` under the key `authToken`. The same token must be used in the
`client/src/config/config.ts` file.
