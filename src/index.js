var path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();

const app = express();
const port = 3000;

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//public
app.use(express.static(path.join(__dirname, 'public')));

// Custom middlewares
app.use(SortMiddleware);

//HTTP logger
// app.use(morgan("combined"));

//Template engine
app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const iconType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                };

                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const icon = icons[iconType];
                const type = types[sort.type];

                return `<a href="?_sort&column=${field}&type=${type}">
                        <span class="${icon}"></span>
                    </a>`;
            },
        },
    }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//Routes
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
