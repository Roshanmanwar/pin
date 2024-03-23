const express = require('express');
const BasicRoutes = require('./routes/routes');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const PORT = 3050;

//to enable post data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "pintrest"
}));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./public'));

app.use('/', BasicRoutes);


mongoose.connect('mongodb://localhost:27017/PINTREST').then(() => {
    app.listen(PORT, () => {
        console.log('server is listening on Port no .', PORT);
    })
}).catch(() => {
    console.log('fail to connect server');
})

