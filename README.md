# ProEvento for CSCI 310

`api/` -- Express backend service for interacting with MySQL database

`front/` -- Next.js frontend

## Setup

### Backend
1. Ask Max or Haeju for `.env.local` files
2. Add them to `front/` and `api/`
3. In `api/`, `yarn`
4. In `api/` `yarn add sequelize-cli`
5. `yarn` <-- run this every time you `git pull`
6. `yarn start`

To create a model:

`sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`

This will create a migration and model file in `sequelize/models` and `sequelize/migrations`, respectively. 


You'll probably need to edit them by hand but its not too difficult to figure out.

To run the migrations, use `sequelize-cli db:migrate`. Use `sequelize-cli db:migrate:undo` to undo the last migration.

If you edit an existing model, create only a migration:
`sequelize-cli migration:generate --name migration-skeleton`

More on this is available at https://sequelize.org/master/manual/migrations.html

Once you create a Model, you'll want to add a routes file for it in `express/routes`.

Then, register that at the top of `express/app.ts`. You should now be able to query the API at `localhost:8080/api/<route>`.
### Frontend
`cd front`

`yarn`

`yarn dev`

#### Resources:

The material UI docs have TONS of awesome examples: https://material-ui.com/components/drawers/

Next.js specific stuff - https://nextjs.org/docs/getting-started
