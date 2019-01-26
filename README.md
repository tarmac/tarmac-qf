## Tarmac Quality Framework Backend

* Meant to serve as an API for the [Web front-end](https://github.com/tarmac/tarmac-qf-web)
* [Designs](https://www.figma.com/file/LrBKAzMhwbvicP5Wl55Y1qcX/tarmac-assesment-tool?node-id=97%3A2) by Maru


### Built With

* [NodeJS](https://nodejs.org/en/) - The framework used
* [PostgreSQL](https://www.postgresql.org/) - The RDBMS
* [Sequelize](http://docs.sequelizejs.com/) - The ORM
* [ExpressJS](https://expressjs.com/) - The web framework used
* [Morgan](https://github.com/expressjs/morgan) - For API logging
* [Jest](https://jestjs.io/) - The testing framework
* [ESLint](https://eslint.org/) - The Javascript linter
* [Husky](https://github.com/typicode/husky) - For Git hooks
* [NodeMon](https://github.com/remy/nodemon) - For application reload on dev

#### Prerequisites

* PostgreSQL
* NodeJS
  ```
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
  nvm install node
  ```

### Installing

1. Create a db named "tarmac-qf" in PostgreSQL and a user "tarmac-qf" with password "tarmac-qf" (this config is on the .env file)
2. Create the tables by running the db migrations
    ```
    sequelize db:migrate
    ```
3. Generate dummy data (optional)
    ```
    sequelize db:seed:all --debug
    ```
4. Run the project
    ```
    nodemon index.js
    ```
5. Import the postman collection https://documenter.getpostman.com/view/2288092/RznBMKj5 \
   Create an environment with the following variables:
  
    | Variable | Value |
    | ------------- | ------------- |
    | api_url  | http://localhost:3000/api  |


### Running the tests

Current tests are both at a model and API level, end to end (inserting into the db)

Run tests only

```
jest
```

Run ESLint only

```
npm run lint
```

Run tests and ESLint

```
npm run test
```

<i> Note: There's a pre-commit hook that runs the linter and the tests before commiting (if any of these fail, the commit will also fail)</i>


### Deployment

TBD.


### Reseting dev DB

In case you want to reset the db and generate the tables and data again (for example when model changes), you can delete all the tables and rerun the migrations.

```
DROP TABLE "SequelizeMeta";
DROP TABLE review_directive;
DROP TABLE directive;
DROP TABLE review;
DROP TABLE project_technology;
DROP TABLE technology;
DROP TABLE project_principal;
DROP TABLE project;
DROP TABLE users;
DROP TABLE organization_domain;
DROP TABLE organization;
```

```
sequelize db:migrate && sequelize db:seed:all --debug
```

### API codes

* 200 - Everytime operation is OK except on create (201)
* 201 - Create
* 422 - Validation error
* 500 - Server internal error

### Steps taken to [create the project](https://gist.github.com/ascuccimarra/f900a637e394a8f005ffa4513eb314ba)
