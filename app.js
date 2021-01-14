const express = require('express')
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

//set static folder
app.use(express.static(`${__dirname}/public`))

//index route

app.get('/', (req, res) => {
    res.render('index')
})


const port = process.env.port || 5000




app.listen(port, () => {
    console.log(`listening on port ${port}`)
})