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
| format       | Format all files with prettier.         .                                                            |
| lint         | Lint all files with ESLint.             .                                                            |
| lint:fix     | Lint all files and automatically fix most of the problems.             .                             |

## Deploy

TODO: Link to the Confluence page describing the entire flow of the project.

## Environment variables

This project uses environemnt variables. For local development, these can be found in the `.env/`
folder in the root of the project.  
There you can find a `.env.template` file which contains all the environment variables used in this
project. Create your own `.env.local` file here with the correct values to get started.

They are provided through the `env_file` property in the `docker-compose.yml` file.

## Team

This project has been created by:
- Andry Charlier: andry.charlier@studiohyperdrive.be

It is currently maintained by:
- Andry Charlier: andry.charlier@studiohyperdrive.be
- Ian Emsens: ian.emsens@studiohyperdrive.be
- Bart Naessens: bart.naessens@studiohyperdrive.be
- Bavo Vanderghote: bavo.vanderghote@studiohyperdrive.be
