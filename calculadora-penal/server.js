const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const crypto = require("crypto")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const db = new sqlite3.Database("./mdt.db")

db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
`)

function hash(text){
return crypto.createHash("sha256").update(text).digest("hex")
}

app.post("/login",(req,res)=>{

const {username,password}=req.body

db.get("SELECT * FROM usuarios WHERE username=?",[username],(err,row)=>{

if(!row) return res.json({success:false})

if(row.password===hash(password)){
res.json({success:true})
}else{
res.json({success:false})
}

})

})

app.post("/criar-policial",(req,res)=>{

const {username,password}=req.body

db.run(
"INSERT INTO usuarios(username,password) VALUES(?,?)",
[username,hash(password)],
err=>{
if(err) return res.json({success:false})
res.json({success:true})
}
)

})

app.listen(3000,()=>{
console.log("Servidor MDT rodando na porta 3000")
})