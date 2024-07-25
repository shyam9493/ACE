const app=require('express')();
const dotenv=require("dotenv");
const conn=require("./connect");
dotenv.config();
const port=process.env.PORT;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

app.get("/",(req,res)=>{
    res.send("Hello World");
});
