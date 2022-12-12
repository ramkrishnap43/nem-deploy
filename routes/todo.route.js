const express = require("express");

const {TodoModel} = require("../models/Todo.model")

const todoRouter = express.Router();

todoRouter.get("/",async (req,res) => {
    const todo = await TodoModel.find();
    res.send(todo)
})

todoRouter.post("/create", async(req,res) => {
    const payload = req.body;

    try{
        const new_todo = new TodoModel(payload);
        await new_todo.save();
        res.send({"msg" : "Todos Posted Successfully"})

    }
    catch(err){
        console.log(err);
        res.send("Something went wrong")
    }
})


todoRouter.patch("/update/:todoID", async(req,res) => {
    const payload = req.body;
    const todoID = req.params.todoID;
    const userID = req.body.userID;

    const todo = await TodoModel.findOne({_id:todoID})
    if(userID !== todo.userID){
        res.send("Not Authorized please login first")
    }
    else{
        await TodoModel.findByIdAndUpdate({_id:todoID}, payload)
        res.send("Todos updated successfully")
    }
   
})

todoRouter.delete("/delete/:todoID", async(req,res) => {
    const todoID = req.params.todoID;
    const userID = req.body.userID;

    const todo = await TodoModel.findOne({_id:todoID})
    if(userID !== todo.userID){
        res.send("Not Authorized please login first")
    }
    else{
        await TodoModel.findByIdAndDelete({_id:todoID})
        res.send("Todos deleted successfully")
    }
})


module.exports = {todoRouter}