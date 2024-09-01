const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")

dotenv.config()

//here stripe secret key is writen   
const stripe = require("stripe")(process.env.SECRET_KEY)

//this one required for avoid customer pay 2times for same product due to network issue
//  const uuid = require("uuid/v4");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 4500;

app.get("/",(req,res)=>{
    res.send("Its working well")
})

app.post("/payment",(req,res)=>{
    const {product,token} = req.body;
    console.log("PRODUCT",product);
    console.log("PRICE",product.price);
    // const idempontencyKey = uuid()

    return stripe.customers
    .create({
        
        email:token.email,
        source: token.id
    }).then(customer =>{
          
       stripe.charges.create({
        amount:product.price *100,
        currency:"usd",
        customer: customer.id,
        receipt_email : token.email,
        description: `PURCHASE OF ${product.name}`,
        shipping:{
            name: token.card.name,
            address:{
                country:  token.card.address_country
            }
        }
       },
    //    {idempontencyKey}
       ); 
 })
.then(result => res.status(200).json(result))
.catch(err => console.log(err))
}); 
app.listen(PORT,()=>console.log(`The server connected on port ${PORT}`))