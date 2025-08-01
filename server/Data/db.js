const mongoose=require("mongoose")
const dotenv=require('dotenv')

dotenv.config()

const connectDb=()=>{
    mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.error(err));
}

module.exports=connectDb