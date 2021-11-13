const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./authRouter')

dotenv.config();

const PORT = process.env.PORT || 4000;
const adminPass = process.env.DB_ADMIN_PASSWORD;

const app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://admin:${adminPass}@valice.0tbcx.mongodb.net/valice?retryWrites=true&w=majority`)
    // await mongoose.connect(
    //   `mongodb+srv://admin:${adminPass}@valice.0tbcx.mongodb.net/valice?retryWrites=true&w=majority`,
    //   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    // )
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
}

start();
