const express = require ('express');
const session = require ('express-session');
let path = require('path');
const bodyParser = require('body-parser');
//const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
let account = [];
//let login = 'oi'
//let password = '123'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dangotestes@gmail.com',
      pass: 'programando'
    }
  });

app.use(session({secret: 'secret'}));
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.set ('view engine', 'html');

app.post('/', (req, res) => {
    //temp2 = account.find(account => account.password === req.body.password && account.login === req.body.login);
    if(temp = account.find(account => account.password === req.body.password && account.login === req.body.login)){
        req.session.temp = temp;
        text = JSON.stringify(account);
        res.render('logado.html', {account: text});
    }else{
        res.render('index.html');
    }
/* foi o teste inicial
    if(req.body.password == password && req.body.login == login) {
        req.session.login = login;
        res.render('logado.html');
    }else{
        res.render('index.html');
    }
    */
})

app.get('/',(req, res) => {
    if(req.session.temp){
        res.render('logado.html',{account: JSON.stringify(account)})
    }else{
        console.log('n ta logado n')
        res.render('index.html');
    }
})

app.get('/register',(req, res) => {
    res.render('register.html')
})

app.post('/register', async(req, res) => {
    try{
        if(!account.find(account => account.login === req.body.login)){
            account.push({
                login: req.body.login,
                password: req.body.password
            })
            console.log(account);
        }
    }catch(err){
        res.redirect('/registerPath')
    }
})

app.post('/enviarEmail', async(req, res) => {
    console.log(req.body.email)
    console.log(req.body.mensagem)
    
    var mailOptions = {
      from: 'dangotestes@gmail.com',
      to: req.body.email,
      subject: 'Email do APP criado',
      text: req.body.mensagem
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.redirect('/');
})

//copiado e adaptado da documentação (https://www.npmjs.com/package/express-session)
app.get('/logout', function (req, res, next) {
    // logout logic
  
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.temp = null
    req.session.save(function (err) {
      if (err) next(err)
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
  })

app.listen(port, () => {
    console.log('listening on port '+port)
})