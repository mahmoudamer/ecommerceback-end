const mongoose = require('mongoose');
const debug = require('debug')('project:server');

const connectionURL = process.env.MONGO_URL || 'mongodb://localhost:27017/project';
debug(`connecting to database on ${connectionURL} `);

mongoose.connect(connectionURL,
    {
        useCreateIndex: true,
        autoIndex: true,
        useNewUrlParser: true
    },
    err => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            debug(`connected to database successfully`)
        }
    }
)