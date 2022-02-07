# Het Archief - backend proxy

## General

This repository contains the NodeJS backend proxy for Het Archief.

It is build with:
- node: `v16.x.x` ( ~ `lts/gallium`)
- yarn: `v1.x.x`
- npm: `v8.x.x`
- Nest: `v8.2.3`

For a complete list of packages and version check out the `package.json` file.

## Setup

### Clone and install dependencies
To setup this project, clone the repo and run `npm i` to install the dependencies.

This will also setup [husky](https://github.com/typicode/husky) via the `npm run prepare` script,
this lifecycle script will run automatically after the install.

> ⚠️ _If you're using Yarn 2 this won't work because the `prepare` lifecycle isn't supported so
> you'll have to run `yarn run prepare` manually.  
> Yarn 1 doesn't have this issue._

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

This project uses environemnt variables. For local development, these can be found in the `.env/`
folder in the root of the project.  
There you can find a `.env.template` file which contains all the environment variables used in this
project.  
Create your own `.env.local` file here with the correct values to get started. Contact one of the
active developers listed below for access to these values.

They are provided through the `env_file` property in the `docker-compose.yml` file.

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

TODO: Link to the Confluence page describing the entire flow of the project.
## Team

This project has been created by:
- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:
- Andry Charlier: andry.charlier@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Bart Naessens: bart.naessens@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
