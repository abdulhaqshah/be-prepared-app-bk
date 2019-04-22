const glob = require('glob');

const routes = [];
glob.sync( './server/routes/**/*.js' ).forEach( function( file ) {
    if(!(file.includes("index"))){
        routes.push(file.replace('/server',''));
    }
  });

module.exports = routes;