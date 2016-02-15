module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        
        //minify all js files
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            assets: {
                files: {
                    'dist/spa.min.js': ['build/spa.js']
                }
            }
        },

        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'build/spa.js',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    sourceMap: true,
                    declaration: true,
                    references: [
                        "typings/main.d.ts"
                    ]
                }
            }
        }
    });
    
    /* load every plugin in package.json */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    /* grunt tasks */
    grunt.registerTask('build', ['typescript', 'uglify']);

};