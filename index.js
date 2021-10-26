const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const Sequelize = require('sequelize');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage')

const sequelize = new Sequelize('todos', 'postgres', '123456789', {
    host: 'localhost',
    dialect: 'postgres'
});  

const ToDo = sequelize.define('todos', {
  title: {
      type: Sequelize.STRING
  },
  description: {
      type: Sequelize.STRING
  }
});

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(express.json());

app.use((req, res, next) => {
console.log('URL = ', req.url);
console.log('Original_URL = ', req.origialUrl);
console.log('METHOD = ', req.method);
console.log('HOST = ', req.headers.host);
console.log('InSecure = ', req.secure);
console.log('BODY', req.body);
console.log('QUERY', req.query);

next();
});

function reverse_case(str) {
    let new_str = ""
    let size = str.length
    for (var i = 0; i < size; i++)
        if (str.charAt(i) == str.charAt(i).toUpperCase())
            new_str += str.charAt(i).toLowerCase()
        else
            new_str += str.charAt(i).toUpperCase()
    return new_str
}

function reverse_arr(array) {
    let new_array = []
    let size = array.length
    for (var i = size - 1; i >= 0 ; i--)
        new_array.push(array[i]);
    return new_array
}

//app.all('/test', (req, res)=>{
//res.status(200).json({message: 'OK'});
//})

app.get('/test', (req, res)=>{
    res.status(200).json({message: 'Get'});
})

app.post('/test', (req, res)=>{
    res.status(200).json({message: 'Post'});
})

app.put('/test', (req, res)=>{
    res.status(200).json({message: 'Put'});
})

app.patch('/test', (req, res)=>{
    res.status(200).json({message: 'Patch'});
})

app.delete('/test', (req, res)=>{
    res.status(200).json({message: 'Delete'});
})

app.get('/sum', (req, res) => {
    let sum = parseInt(req.query.num1) + parseInt(req.query.num2)
    console.log(`sum = ${sum}`);
    res.status(200).json({sum})
});

app.get('/reverseCase', (req, res) => {
    let result = reverse_case(req.query.str)
    console.log(`reverse = ${result}`);
    res.status(200).json({result})
});

app.post('/reverseArray', (req, res) => {
    let result = reverse_arr(req.body.array)
    console.log(req.body.array);
    console.log(`reverse = ${result}`);
    res.status(200).json({result})
});

function load_data(arr)
{
    if (!localStorage.getItem("text"))
        return;
    let save = localStorage.getItem("text").split(',');
    save.forEach(i => arr.push(i));
}
let arr = [];
load_data(arr);

app.post('/strings', (req, res) => {
    arr.push(req.body.text);
    localStorage.setItem('text', arr);
    res.status(200).json({ message: "OK" })
})
app.get('/strings', (req, res) => {
    res.status(200).json({ message: arr })
})
app.get('/strings/:index', (req, res) => {
    res.status(200).json({ message: arr[req.query.index] })
})
app.delete('/strings', (req, res) => {
    arr.splice(0, arr.length)
    localStorage.removeItem('text');
    console.log(arr);
    res.status(200).json({ message: "OK" })
})
app.delete('/strings/:index', (req, res) => {
    arr.splice(req.query.index, 1);
    localStorage.setItem("text", arr);
    res.status(200).json({ message: arr })
})

// CRUD for ToDo
app.get("/todo", (req, res) => {
    ToDo.findAll().then(todo=>{
      res.status(200).json({ message: "OK" })
    }).catch(err => console.log(err));
});
 
app.post("/todo", (req, res) => {
    if(!req.body) return res.sendStatus(400);
    ToDo.create({ 
        title: req.body.title, 
        description: req.body.description
    }).then(todo=>{
        res.status(200).json({ message: "OK" })
      }).catch(err => console.log(err));
});

app.put("/todo",(req, res) => {    
    if(!req.body) return res.sendStatus(400);
    ToDo.update({
        title: req.body.title, 
        description: req.body.description
    }).then(todo=>{
        res.status(200).json({ message: "OK" })
      }).catch(err => console.log(err));
  });

app.delete("/todo", function(req, res){  
  ToDo.destroy().then(todo=>{
    res.status(200).json({ message: "OK" })
  }).catch(err => console.log(err));
});

http.createServer(app).listen(3000, () => {
console.log('Server is working on port 3000');
})