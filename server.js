const express = require('express')
const app = express()
const morgan=require('morgan')
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const port = 3000

mongoose.connect(
    "mongodb+srv://root:root@node-api-shop-ismdd.mongodb.net/pulkit?retryWrites=true&w=majority",
  
     { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }
  );

mongoose.Promise = global.Promise;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/order')
const userRoutes=require('./api/routes/users')

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Accept, Authorization')

    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
})



app.use('/products',productRoutes); 
app.use('/orders',orderRoutes); 
app.use('/user',userRoutes); 

//if none of the above routes work

app.use((req,res,next)=>{
    const err=new Error('Not found');
    err.status=404;
    next(err);
})

app.use((error,req,res,next)=>{
    res.status(error.status|| 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))