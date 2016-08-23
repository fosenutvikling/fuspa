module.exports = function (grunt) {
    'use strict';

    var webpack = require('webpack');
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

        webpack: {
            web: {
                entry: './src/main.ts',
                output: {
                    filename: './dist/spa.min.js',
                    library: 'Spa',
                    libraryTarget: 'umd',
                    umdNamedDefine: true,
                },
                devtool: 'source-map',
                resolve: {
                    // Add `.ts` and `.tsx` as a resolvable extension.
                    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
                },
                module: {
                    loaders: [
                        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                        { test: /\.tsx?$/, loader: 'ts-loader' }
                    ]
                },
                node: {
                    fs: "empty"
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin()
                ]
            }
        },

        dtsGenerator: {
            options: {
                baseDir: './src',
                name: 'Spa',
                project: '',
                out: 'dist/spa.d.ts'
            },
            build: {
                src: ['src/**/*.ts']
            }
        }
    });

    /* load every plugin in package.json */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks('dts-generator');
    /* grunt tasks */
    grunt.registerTask('build', ['webpack', 'dtsGenerator']);

};