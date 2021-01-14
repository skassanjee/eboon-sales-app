const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
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


//charge route

app.post('/charge', (req, res) => {
    const amount = 2500
    // console.log(req.body) -- shows us what is available when we submit the payment form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'web dev ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'));
})

//index route

app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    })
})




const port = process.env.port || 5000




app.listen(port, () => {
    console.log(`listening on port ${port}`)
})