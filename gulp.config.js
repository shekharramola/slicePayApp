module.exports = function() {
    var src = 'src',
        clientApp = 'src/app',
        clientMock = 'src/app/mockbackend',
        dist = 'dist',
        tmp = '.tmp',
        docs = 'documentation',
        landing = 'landing';
    var config = {
        src: src,
        proxy:{
            production:{
                url:"http://sliacPay.in:8080",
                route:"/api",
                host:"proxy"
            },
            dev:{
                url:"http://localhost:3000",
                route:"/api",
                host:"proxy"
            }
        },
        dist: dist,
        tmp: tmp,
        index: src + "/index.html",
        alljs: [
            src + "/app/**/*.js",
            './*.js'
        ],
        assets: [
            src + "/app/**/*.html",
            src + "/bower_components/font-awesome/css/*", 
            src + "/bower_components/font-awesome/fonts/*", 
            src + "/bower_components/weather-icons/css/*", 
            src + "/bower_components/weather-icons/font/*", 
            src + "/bower_components/weather-icons/fonts/*", 
            src + "/bower_components/material-design-iconic-font/dist/**/*",
            src + "/assets/**/*",
            src + "/styles/loader.css", 
            src + "/styles/images/*", 
            src + "/assets/favicon.ico"
        ],
        less: [],
        sass: [
            src + "/styles/**/*.scss"
        ],
        js: [
            clientApp + "/**/*.module.js",
            clientApp + "/**/*.js",
            '!' + clientApp + "/**/*.spec.js",
            '!' + clientMock + "/*.js"
        ],
        mockjs: [
            clientApp + "/**/*.module.js",
            clientApp + "/**/*.js",
            src + "/bower_components/angular-mocks/angular-mocks.js",
            '!' + clientApp + "/**/*.spec.js"
        ],
        docs: docs, 
        docsJade: [
            docs + "/jade/index.jade",
            docs + "/jade/faqs.jade",
            docs + "/jade/layout.jade"
        ],
        allToClean: [
            tmp, 
            ".DS_Store",
            ".sass-cache",
            "node_modules",
            ".git",
            src + "/bower_components",
            docs + "/jade",
            docs + "/layout.html",
            landing + "/jade",
            landing + "/bower_components",
            "readme.md"
        ]
    };

    return config;
};