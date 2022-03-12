if(process.env.Node_ENV !== 'production'){
    require('dotenv').config()
}
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const ejs=require('ejs');
const bodyParser= require("body-parser");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const port = process.env.PORT || 3000

mongoose.connect("mongodb+srv://yadi1234:12798071@cluster0.jhbuu.mongodb.net/users",{useNewUrlParser: true},{useUnifiedTopology: true})
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.set('view engine','ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true}));
var balance = null
var destination = null


//
const userSchema={
    username: String,
    phone:Number,
    pass:String,
    email:String,
}

const driverSchema={
    username: String,
    phone:Number,
    email:String,
    plateNo:String,
    carType:String, 
}


const orderSchema = new mongoose.Schema({
    user_name:String,
    pick_place:String,
    drop_place:String,
    seat_number:String,
    car_type:String,
    paid_money:String,
    driver_name:String
},{timestamps: true})

const orders_tb = mongoose.model('orders_tb',orderSchema) 
const users = mongoose.model('users',userSchema)
const drivers = mongoose.model('drivers', driverSchema)

const storeItems = new Map([
    [1, { priceInCents: 1000, name: "mesalemia to Autobustera" }],
    // [2, { priceInCents: 1500, name: "Mexico to stadium" }],
  ])

app.get('/',(req,res) => {
   
    res.sendFile(__dirname + '/public/login.html') 
 })

 app.get('/createtrip',(req,res) => {
   
    res.sendFile(__dirname + '/public/createtrip.html') 
 })


app.get('/user',(req,res) => {
    orders_tb.find({user_name:username},function(err,orders_tb){
        console.log(orders_tb);
        res.render('user',{
            orderList:orders_tb
        })
     
    })
})
app.get('/orders',(req,res) => {
    orders_tb.find({},function(err,orders_tb){
       console.log(orders_tb);
       res.render('orders',{
           orderList:orders_tb
       })
    
   })
})
app.get('/order',(req,res) => {
    users.find({},function(err,users){
       console.log(users);
       res.render('order',{
           userList:users
       })
    
   })
})
app.get('/driver',(req,res) => {
    drivers.find({},function(err,drivers){
       console.log(drivers);
       res.render('driver',{
           driverList:drivers
       })
    
   })
})




app.post("/",(req,res)=>{ 
 
let newPost= new users({
    username: req.body.username,
    phone:req.body.phone,
    pass:req.body.pass,
    email:req.body.email
 
});
newPost.save();
res.redirect("/");

})



app.post("/confirm",(req,res)=>{ 
    balance = req.body.balance_info
    destination = req.body.pick_up_info + " to " + req.body.drop_off_info
    // console.log("inside conform ",req.body.balance_info)
    let neworder= new orders_tb({
        // username: req.body.username,
        // phone:req.body.phone,
        // pass:req.body.pass,
        // email:req.body.email
        
        user_name:username,
        pick_place:req.body.pick_up_info,
        drop_place:req.body.drop_off_info,
        seat_number:req.body.seats_info,
        car_type:req.body.car_type_info,
        paid_money:req.body.balance_info,
        driver_name:req.body.Driver_Name, 
});
    console.log(neworder)
    neworder.save();
    res.status(400);
    
    })



let email = null;
let username = null;
app.post('/login', async (req,res) => {
 
    console.log("inside login")
    const result = await users.findOne({username:req.body.username})

    if(result) {
        pass = result.pass;
        username = result.username;
    } 

     console.log(email)
     console.log(username)

    if(req.body.username == "yididiya" && req.body.pass == "email")
    {
        res.sendFile(__dirname + "/public/admin.html")
    }
    else if(req.body.username == username && req.body.pass == pass)
    {
        
        res.redirect('/createtrip')
    }
    else{
        res.end('no credential')
    }
    
})

// Create a post request for /create-checkout-session
app.post("/checkout", async (req, res) => {
    let whole = balance.length
    let money = balance.substr(0,whole-4)
    money = parseInt(money) * 100
    try {
      // Create a checkout session with Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // For each item use the id to get it's details
        // Take that information and convert it to Stripe's format
        line_items: req.body.items.map(({ id, quantity }) => {;
          const storeItem = storeItems.get(id)
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: destination,
              },
              unit_amount: money,//storeItem.priceInCents,
              // unit_amount: sessionStorage.getItem('balance'),
            },
            quantity: quantity,
          }
        }),
        mode: "payment",
        // Set a success and cancel URL we will send customers to
        // They are complete urls    
        success_url: `${process.env.SERVER_URL}/success.html`,
        cancel_url: `${process.env.SERVER_URL}/cancel.html`,
      })
  
      res.json({ url: session.url })
    } catch (e) {
      // If there is an error send it to the client
      res.status(500).json({ error: e.message })
    }
  })


app.listen(port,function(){ 
    console.log("server listening");
})
// Get-ExecutionPolicy
// Set-ExecutionPolicy Unrestricted