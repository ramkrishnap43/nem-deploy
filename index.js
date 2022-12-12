const express = require("express")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const cors = require("cors")

const {connection} = require("./config/db");
const { UserModel } = require("./models/User.model");

const app = express();
const {todoRouter} = require("./routes/todo.route");
const { authenticate } = require("./Middlewares/authentication");
app.use(express.json())

app.use(cors({
    origin : "*"
}))
app.post("/signup" , async(req,res) => {
    const {email,password} = req.body;
    const userPresent = await UserModel.findOne({email})
    if(userPresent?.email){
        res.send("Email already exists")
    }
    else{
        try{
            bcrypt.hash(password, 4, async function(err,hash) {
                const user = new UserModel({email, password:hash})
                await user.save();
                res.send("Your Sign up sucessfull")
            })
            
        }
        catch(err){
            console.log(err)
            res.send("Something went wrong")
        }
    }
})

app.post("/login", async(req,res) => {
    const {email,password} = req.body;

    try{
        const user = await UserModel.find({email})
        if(user.length > 0){
            const hashedPassword = user[0].password;
            bcrypt.compare(password, hashedPassword, function(err, result){
                if(result){
                    const token = jwt.sign({"userID" : user[0]._id}, "hush") 
                    res.send({"Msg" : "Login successfull", "token" : token})
                }
                else{
                    res.send("Login failed")
                }
            })
        }
        else{
            res.send("Login failed again")
        }

    }
    catch(err){
        console.log(err)
        res.send("Something went wrong")
    }
})


app.use(authenticate)

app.use("/todos", todoRouter)

app.listen(8050, async() => {
    try{
        await connection
        console.log("Connected to db successfully")
    }
    catch(err){
        console.log(err);
        console.log({"err" : "something went wrong here"})
    }
    console.log("Listening on Port 8050")
})



