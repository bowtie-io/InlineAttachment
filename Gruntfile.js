/**
 * Grunt Build File
 */
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: require('./package.json'),
    jshint: {
      all: ['src/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        undef: true,
        unused: true,
        strict: false,
        trailing: true,
        esversion: 6,
        asi: true,
        indent: 2
      }
    },
    casperjs: {
      options: {
      },
      files: ['tests/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casperjs');

  // https://github.com/webpack/grunt-webpack/issues/29
  grunt.registerTask('webpack', function(mode) {
    var done = this.async();
    var config = require('./webpack.config');
    var webpack = require('webpack')

    var handler = function(err, stats) {
      console.log(stats.toString({
	colors: true
      }));

      done(!err && !stats.hasErrors());
      done = function() {};
    };

    var compiler = webpack(config);
    if (mode === 'development') {
      compiler.watch(grunt.config('jsConfig.watchDelay'), handler);
    } else {
      compiler.run(handler);
    }
  });

  grunt.registerTask('default', ['jshint', 'casperjs', 'webpack']);
};
