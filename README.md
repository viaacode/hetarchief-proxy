# Het Archief - backend proxy

## General

This repository contains the NodeJS backend proxy for Het Archief.

It is build with:

- node: `v16.x.x` ( ~ `lts/gallium`)
- npm: `v7.x.x`
- Nest: `v8.2.3`

For a complete list of packages and version check out the `package.json` file.

## Setup

### Clone and install dependencies

To setup this project, clone the repo and run `npm i` to install the dependencies.

This will also setup [husky](https://github.com/typicode/husky) via the `npm run prepare` script,
this lifecycle script will run automatically after the install.

### Docker

This project runs with Docker for local development and production images.

To start working, simply run `docker-compose up`, the project will be available on port `3100`.

### NPM

The available commands for development are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| start        | Run the develompent server.                                                                          |
| start:dev    | Run the development server in watch mode.                                                            |
| start:prod   | Run the server in production mode.                                                                   |

<br>

The available commands for building the project are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| build        | Build a production ready app to the `/dist` folder.                                                  |

<br>

The available commands for testing the project are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| test         | Run all the unit tests.                                                                              |
| test:watch   | Run all the unit tests in watch mode.                                                                |
| test:cov     | Run all the unit tests with coverage collected.                                                      |
| test:e2e     | Run all the integration tests.                                                                       |

<br>

Other available commands are:

| command      | runs                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------|
| format       | Format all files with prettier.                                                                      |
| lint         | Lint all files with ESLint.                                                                          |
| lint:fix     | Lint all files and automatically fix most of the problems.                                           |

## Environment variables

This project uses environment variables. For local development, these can be found in the `.env/`
folder in the root of the project.  
There you can find a `.env.template` file which contains all the environment variables used in this
project.  
Create your own `.env.local` file here with the correct values to get started. Check 1password (`hetarchief bezoekerstool - proxy backend - .env.local (bzt)`)
to find the end var values for local development or contact
a developer of the project (see package.json for a list of contributors).

They are provided through the `env_file` property in the `docker-compose.yml` file.

There are a few debug env vars that can be useful:

* Log queries and responses from the elasticsearch instance:
  ```
  ELASTICSEARCH_LOG_QUERIES=true
  ```

* Ignore object licenses in the database:
  ```
  IGNORE_OBJECT_LICENSES=true
  ```

* Enable sending email and redirect CP emails to a different email address:
  ```
  ENABLE_SEND_EMAIL=true
  REROUTE_EMAILS_TO=bert.verhelst@studiohyperdrive.be 
  ```

* Change the elasticsearch endpoint to debug with more search results on QAS or PRD:
  ```
  ELASTICSEARCH_URL=http://es-prd-hetarchief.private.cloud.meemoo.be
  ELASTICSEARCH_URL=http://es-qas-hetarchief.private.cloud.meemoo.be
  ELASTICSEARCH_URL=http://es-int-hetarchief.private.cloud.meemoo.be
  ```

## External services

### Hasura

#### Installation

To run Hasura (Database / GraphQl) locally, follow the instructions as described in https://github.com/viaacode/hetarchief-hasura

#### Usage

Simply run ```docker-compose up``` to start all necessary services. The hasura console will be available on http://localhost:9000
Frequently pull this repo and update hasura to stay in sync.

#### Metadata, Migrations and Seeds

In the `hetarchief-hasura` folder, run the following commands (requires the hasura-cli):

```
hasura metadata apply
hasura migrate apply
hasura metadata reload
hasura seed apply //Select database 'hetarchief'. If all went fine, you'll see the message `INFO Seeds planted` as confirmation.
```

##### Update on server

```
hasura seed apply --endpoint https://hasura-graphql-tst-hetarchief.private.cloud.meemoo.be --admin-secret <secret>
```

## Deploy

* The latest PR gets deployed to the INT environment
* commits on develop => get deployed to the TST environment
* commits on master => get deployed on the QAS environment
* tags on master => get deployed on the PRD environment (wait for QAS build to be finished before tagging master)

## Team

This project has been created by:

- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:

- Bart Naessens: bart.naessens@studiohyperdrive.be
- Bert Verhelst: bert.verhelst@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
