const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const request = require('request')
const path = require('path')

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

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

//newsletter signup route

app.post('/signup', (req,res) => {
    const {firstName, lastName, email } = req.body
    
    //validation
    if(!firstName || !lastName || !email){
        console.log('add a redirect')
        //res.redirect('/fail.html') return
    }

 
    //mailchimp

    //construct req data

    const data ={
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data)

    const options = {
        url:  'https://us1.api.mailchimp.com/3.0/lists/d778c1f68e',
        method: 'POST',
        headers:{
            Authorization: keys.mailchimpKey
        },
        body: postData
    }

    request(options, (err, response, body) => {
        if(err){
            res.redirect('/fail.html')
            console.log(err)
        }
        else{
            if(response.statusCode === 200){
                res.redirect('/success.html')
            }
            else{
                res.redirect('/fail.html')
            }
        }
    })
})

const port = process.env.port || 5000
gi



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})