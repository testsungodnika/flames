const express = require('express');
const app = express()
const ejs = require('ejs');
const bodyParser = require("body-parser");
const cors = require("cors")

app.set("view engine","ejs");
app.use(express.static(__dirname+"/static"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.set('trust proxy', true)

const firebase = require('firebase-admin');
var serviceAccount = require(__dirname+"/flames-630b0-firebase-adminsdk-euurd-e9b9775c03.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://your-domain.firebaseio.com"
});

//const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const names = db.collection("names");

function ord(a)
{
  return a.charCodeAt(0)-'a'.charCodeAt(0);
}

function flamesCheck(name1,name2) {

  name1 = name1.toLowerCase();
  name2 = name2.toLowerCase();

  var arrname1 = new Array(26);
  var arrname2 = new Array(26);

  for(var i=0;i<26;i++)
  {
    arrname1[i] = 0
    arrname2[i] = 0
  }

  for(var i=0;i<name1.length;i++)
  {
    if(name1[i]>='a' && name1[i]<='z')
    arrname1[ord(name1[i])]++;
  }

  for(var i=0;i<name2.length;i++)
  {
    if(name2[i]>='a' && name2[i]<='z')
    arrname2[ord(name2[i])]++;
  }

  for(var i=0;i<26;i++)
    arrname1[i] = Math.abs(arrname1[i]-arrname2[i]);

  var count = 0;
  for(var i = 0;i<26;i++)
    count+=arrname1[i]

  var res = ["Friends 🐾","Lovers 👩🏻‍🤝‍🧑🏽","Affectionate 😪","Married 👨‍👨‍👧","Enemies 🤬","Siblings 🤼‍♂️"]
  var emotes = ["&#10084","&#10084","&#10084","&#10084","&#10084","&#10084"]

  for(var i=0;i<5;i++)
  {
    res.splice((count-1)%(6-i),1)
    emotes.splice((count-1)%(6-i),1)
  }

  return [res[0],emotes[0]];
}

var rec=false;
var name1,name2,result;

app.post("/",async(req,res)=>{
  name1 = req.body.name1;
  name2 = req.body.name2;
  var addr = req.ip

  rec = true;
  result = flamesCheck(name1,name2)

  await names.add(
    {
      name1:name1,
      name2:name2,
      relation:result[0],
      address:addr
    }
  )
  res.redirect("/");

  //res.send(flamesCheck(name1,name2));
})

app.get("/",(req,res)=>{
  //console.log("kikii");
  if(rec)
  {
    rec = false;
    //console.log(name1)
    res.render("index",{rec:true,name1:name1.trim(),name2:name2.trim(),result:result[0],emote:result[1]});
  }
  else {
    res.render("index",{rec:false,name1:name1,name2:name2,result:result[0],emote:result[1]});
  }

})

app.listen(3000,()=>{
//  console.log("hehehe");
console.log("Server is Running")
})
