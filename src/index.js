const express = require('express');
const app = express();
app.use(express.json());
produtoRouter = require('./routers/produto.router')
var expressLayouts = require('express-ejs-layouts');


app.set('view engine', 'ejs');
app.use(expressLayouts);

app.set('layout', 'layouts/layout')

app.use('/static', express.static('public'));
app.use('/produtos', produtoRouter);

app.listen(8080);