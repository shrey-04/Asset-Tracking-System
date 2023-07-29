# Asset-Tracking-System
It is a blockchain application which can help in tracking of assets.
The backend and frontend code is in the respective branches.

## Technologies Used:
1. Angular JS for frontend
2. Spring boot for backend
3. Hibernate for ORM
4. MYSQL Database
5. Solidity for Smart contract development
6. Ganache for local blockchain development

## Installations
1. Node JS
2. Angular CLI
3. Package Manager: npm
4. Java 17
5. MYSQL sever
6. Ganache


## Steps to run the backend in java
1) Clone the Project from backend branch
2) Install all the dependencies
3) Change the database configuration and blockchain account's private key
4) Run application
5) Open http://localhost:8088/swagger-ui.html#/ in the browser to check the APIs

## Steps to run the frontend in angular
1) Clone the Project from frontend branch
2) Go inside the src folder and run the command 'npm install'
3) After successful installation run the command 'ng serve'
4) Install the packages if not properly install by using 'npm install package_name' For eg: 'npm install @nobel/curves' and run 'ng serve' 
5) Open localhost:4200 in the browser


## Steps to create database and configure ganache
1) Install MYSQL server and Ganache
2) Open MYSQL command line client and create database using command 'create database db_name;'
3) Open Ganache and get the private key of one of the ten accounts listed.
4) Use the above details in the spring boot application
