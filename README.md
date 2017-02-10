##Installing requirements

In order to get started you need to install the following on your development computer..

* Node.js and NPM. You can download Node.js from here https://nodejs.org/download/. Npm comes bundled with Node.js
* Also install bower and grunt-cli using this command npm install --global bower grunt-cli
* You'll also need to run npm install and bower install from the root of your project to install all the necessary dependencies.

Once you have all tools and dependencies installed you can use these commands for your project:

* grunt serve - launches a localhost preview of your app (with Livereload)
* grunt or grunt build - build an optimized, production-ready version of your app.

In your browser, go to http://localhost:9001/#/

##Configuration

The MGM REST API confifguration is available in the app.js file 

https://github.com/cern-eos/eos-admin-gui/blob/develop/app/scripts/app.js#L35

* baseUrl
* port
* pollingInterval ( in ms)
