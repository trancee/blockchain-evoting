'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    SRI: {
      enabled: false,
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // browserify main.js -o vendor/bundle.js
  // app.import('vendor/bundle.js');
  app.import('vendor/abi.js');

  app.import('vendor/SRGSSRTypeVF_Text_W_Wght.woff2', {
    destDir: 'assets',
  });

  return app.toTree();
};
