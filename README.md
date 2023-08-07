# viikkoBiitsi
A program for calculating/showing scores for weekly beach volley tournaments. The program has PHP backend, PHP scripts for Wordpress page and React adimin UI.


## How to run the program
The program has been containerized and it has docker-compose.yaml file in the root folder which has all the needed configurations to run the program. `docker compose up` command  starts a database, phpmyadmin, the back-end and the front-end. You can use phpmyadmin to run queries to the database.  /backEnd/SQL/schema.sql file creates the database and /backEnd/SQL/testData.sql has test data for testing. Testing user credentials are username: admin, password: admin.

## How to test the program
The program has unit tests for some React component, API tests for the backend and UI tests for the admin UI. All the tests use Node.js to run the tests. Tests need local Node installation and Node version 18 is used to run the tests. React unit tests use testing-library/react to test the components.  the unit tests are run with the command `npm test` in /adminUI folder. Jest is used for API tests and the tests require that back-end and the database are running. The database needs to be created with the /backEnd/SQL/schema.sql file before running the tests. API tests are run with the command `npm test` in /e2eTest/backEndTests folder. Cypress is used to UI tets and 