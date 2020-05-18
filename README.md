# Tysk

The front-end is available in [/client](/client/README.md).

## Available Scripts

Every `yarn` command can be changed to `npm run`
In the project directory, you can run:

### `yarn start`

Runs the app in production mode.

### `yarn dev`

Runs the app in development mode.

### `yarn build`

Build the front-end in `client/build` and back-end in `build`.

### Knex Script's

### `yarn migrate:make <name>`

Create a named migration file.

### `yarn migrate:latest`

Run all migrations that have not yet been run.

### `yarn migrate:down [<name>]`

Undo the last or the specified migration that was already run.

### `yarn migrate:rollback`

Rollback the last batch of migrations performed.

### `yarn seed:make <name>`

Create a named seed file.

### `yarn seed:run`

Run seed files.
