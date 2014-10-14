'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    copy: {
        build: {
            cwd: '',
            src: ['**', '!**/node_modules/**', '!**/dist/**',  '!**/*.ftppass', '!**/package.json', '!**/Gruntfile.js'],
            dest: 'dist',
            expand: true
        }
    },

    clean: {
        build: {
            src: ['dist']
        }
    },

    processhtml: {
      options: {
        process: true
      },
      'dist/index.html': ['dist/index.html']
    },

    jshint: {
      options: {
        curly: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      js: {
        src: 'js/*.js'
      }
    },

    watch: {
      index:{
        files: ['*.html'],
        options: {
          livereload: 35729
        }
      },
      js: {
        files:['js/*.js'],
        tasks: ['jshint:js'],
          options:{
          livereload: 35729
        }
      }
    },

    connect:{
      server:{
        options:{
          port: 5000,
          livereload: 35729
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  

  grunt.registerTask('default', ['connect','watch','jshint']);

  grunt.registerTask('prepare', ['jshint', 'clean', 'copy', 'processhtml']);

  

};
