import express from 'express';
//rest object   "type": "module",
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path';    


dotenv.config();
//database config           npm run server
connectDB();
const app=express()
//middelwares


// app.use(cors())

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin); // Allow all origins dynamically
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname,'./client/build')))



app.use('/api/v1/auth',authRoute); //auth route
app.use('/api/v1/category',categoryRoutes); //category route
app.use('/api/v1/product',productRoutes); //product route

// app.use('*',function(req,res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })


//rest api
app.get('/',(req,res)=>{
    // res.send({message:"welcome to the e commerce app MERN STACK PROJECT"})
    res.send('<h1>welcome to the e commerce app MERN STACK PROJECT</h1>')
})

//port
const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is running on ${process.env.DEV_MODE} mode port http://localhost:${PORT}`.bgCyan.white);
})
