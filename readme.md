"scripts": {
"start": "nodemon backend/server.js",
"dev": "webpack --mode development --watch",
"all": "webpack --mode development --watch & webpack-dev-server --mode development",
"prod": "webpack --mode=production",
"client": "npm start --prefix frontend",
"test": "echo \"Error: no test specified\" && exit 1"
},
