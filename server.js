const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', routes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
