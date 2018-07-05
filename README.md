"URL Shortener" - the application has a form with a field where the user can put a valid URL and the field for entering the desired short URL. The application generates a short url. Example: "http: // domaincom / cedwdsfl". Application is validated if requested short url is not in use yet. Application stores original and short url pair in DB.  User that can share short url with other users and at once they try to access short url they are redirected to original url.

Additional credit:
The application has a configuration file. The application deletes the source pair from the database on the 15th day after its creation. The application calculates the amount of using a short URL.


Installation:
using HTTPS or SSH, go to the folder and run the command "npm install". Dependency packages are installed.

There is a possibility to start in two modes:
- for use: "npm run start"
- for development: "npm run dev". In this mode, nodemon will automatically restart your application node (https://www.npmjs.com/package/nodemon).

The application uses third-party packages:
"Body-parser": "^ 1.18.3" - analyzes incoming requests in the middleware before your handlers, available under the req.body property.
"Cors": "^ 2.8.4" - CORS is the node.js package to provide the Connect / Express middleware that can be used to enable CORS with different parameters.
"express": "^ 4.16.3" - is the standard framework for Node.js
"moment": "^ 2.22.2" - work with time
"mongodb": "^ 3.0.10" - work with the database
"node-cron": "^ 1.2.1" - running the tasks on the NodeJS server according to the schedule
"request": "^ 2.87.0" - check the URL's validity 


Setting up the applications:
When the application starts, it uses the port: 8000. If this port is occupied by another application, change the "port" parameter in the utils / config.js file.

The application requires a mongodb database. By default, the database from mlab.com is used. The configuration is performed in the file "utils / config.js", by changing the line 'mongodb: // <user>: <password> @ <site_data>: <port> / <database_name>'.

When setting up the database, it is necessary to take into account that the <user>: <password> pair is used not from the account, but from the user who is allowed to use the selected database, in our case <base_name> - "/ urllist". These settings are set on the site "mlab.com". You must also specify the database name in the file "utils / config.js" parameter databaseName: <database_name>.

Set the serverHost parameter: <server_adress>, the name of the resource on which the server code is run. If the server is running on the local server, you must specify "http: // localhost: <port> /", and specify the port after the colon.