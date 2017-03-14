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

The MGM REST API configuration is available in the app.js file 

https://github.com/cern-eos/eos-admin-gui/blob/develop/app/scripts/app.js#L35

* baseUrl
* port
* pollingInterval ( in ms)

The app should connect to an  eos-nginx gateway ( via https and X509 Authentication) which can be deployed on the same MGM node or on a separate machine

The following configuration then is needed:

* add https gateway configuration on the MGM: eos -b vid enable https
* map the DNs whom should have access as admin as root in the /etc/grid-security/grid-mapfile  on the eos-nginx node, i.e.
   * "/DC=ch/DC=cern/OU=Organic Units/OU=Users/CN=amanzi/CN=683749/CN=Andrea Manzi" root



