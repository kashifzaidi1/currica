### Currica is a miniature course management system.
> ## - Setup the API

> - create a `mysql` database named `rppdb`
> - open `rppApi/models/index.js` and set your crediantials at `line 6`.
> ```javascript
>   sequelize = new Sequelize('rppdb', 'username', 'password'); // your username and passwor here
> ```
> - fire up Terminal, `cd` to `currica\rppApi` and do a `npm install`
> - when done, you can easily run the Backend Api by `node app.js`. you should see this in your terminal
> ```
>  Express server listening on port 3000
> ```

> ## - Setup the Frontend

> - setup the backend url in `rppFrontEnd/scripts/services/api` at `line 9`.
> ```javascript
>   ApiService.baseUri = "http://0.0.0.0:3000/"; // your backend url here
> ```
> - fire up Terminal, `cd` to `currica\rppFrontEnd` and do a `npm install`
> - then do a `bower install`
> - when done, you can easily run the Frontend by running `grunt` command. 
> - Fire up the url in a decent browser and youre set to go.


#### TODO
> make these changes easy to make in a config file :)
