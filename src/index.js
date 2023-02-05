var path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const route = require('./routes');

const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//public
app.use(express.static(path.join(__dirname, 'public')));

//HTTP logger
// app.use(morgan("combined"));

//Template engine
app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Routes
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
