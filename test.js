var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serviceAccount = require('./keys.json');
var firebase = require("firebase");
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var nodemailer = require('nodemailer');
var configuration = require("./configuration.js");
var message = require("./message.js");

var config = {                                          //Setting up database
    apiKey: "AIzaSyARk5k9jBvqHHjniavl08r84ReHjYPBSYc",
    authDomain: "data-ccd0e.firebaseapp.com",
    databaseURL: "https://data-ccd0e.firebaseio.com",
    projectId: "data-ccd0e",
    storageBucket: "data-ccd0e.appspot.com",
    messagingSenderId: "262459432768"
  };

 firebase.initializeApp(config);              //Initializing database
 var database = firebase.database();
 var bin = database.ref("binMetaData");       //Connecting database which has bin data/information
 var users = database.ref("users");           //Connecting database which has users data information
 var address = process.argv[2];
 var user = database.ref("users");
 var readBin = database.ref("binReadings");
 var location = database.ref("locations");
 var notificationUsers = database.ref("notificationUser");
 var notifications = database.ref("notifications");


 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
 io.origins('*:*');


 app.use(morgan('dev'));                                         // log every request to the console
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());


//Method that creates the transport and takes of the user who sends the email
 var smtpTransport = nodemailer.createTransport({
  service: configuration.getService(),
  auth: {
    user: configuration.getUser(),
    pass: configuration.getPassword()
  }
});

var msg = {
  from: message.getFrom(),
  subject: message.getSubject(),
  //text: message.getText(),
  status: message.getStatus()
}

/*
app.get("/api/sendEmail", function(req,res){
   readBin.once("value", function(snapshot, errorData) {
   var data = snapshot.val();
   var keys = Object.keys(data);
   //var count = 0;
   var user = [];
   for(var i = 0; i < keys.length; i++)
   {
     var k =  keys[i];
     var level = data[k].payload_fields.level;      //Getting level of the bins
     var id = data[k].payload_fields.hardware_id;


     if(level <= 24)                                 //Check if it is greater than 80%
     {
       //if(count == 0)
       //{
         function getTheUsers()     //Getting all the users who are subsrcibed to notification
         {
             return new Promise(function(resolve, reject)
             {
               notificationUsers.once("value", function(snapshot){
             var data = snapshot.val();
             var keys = Object.keys(data);
             //console.log( data);
             for(var i = 0; i < keys.length; i++)
             {
               var k =  keys[i];
               user[i] = data[k];        //Storing the users in the array from object
             }
             resolve(user);
           });
         })
         }
         getTheUsers().then(function(users){
           users.forEach(function (to, i , array) {       //Loop thru array for sending emails to multiple users
             msg.to = to.email;
         smtpTransport.sendMail(msg, function (err) {
            if (err)
            {
             console.log('Sending to ' + to + ' failed: ' + err);
             return;
            }
            else
            {
              console.log(`${id} at the ${location} is above 80% full`);
              console.log('Sending to ' + to.email + ' success: ');
              res.status(200).json({message: "Success: Successfully sent the emails.", result: true});
              var location;

                notifications.push({
                email: to.email,
                status: msg.status,
                message: `${id} at the ${location} is above 80% full `
              });
            }

           if (i === maillist.length - 1)       //If the length of mail list gets finished, then closing the connection
           {
               msg.transport.close();
           }
         });
         });

         });
         //count++;
       //}
     }
   }
});
});
*/
//----------------------------------------------------------------------------------------------
/*
readBin.once("value", function(snapshot){
    var data = snapshot.val();
    var keys = Object.keys(data);
    for(var i = 0; i < keys.length; i++)
    {
      var k = keys[i];
      if(data[k].payload_fields.level == 0)
      {
        console.log(data[k]);
      }
    }
  }); */

  /*readBin.on("value", function(snapshot) {
   var data = snapshot.val();
   var keys = Object.keys(data);
   var binData = [];
   var binIds = [];
   var user = [];
   for(var i = 0; i < keys.length; i++)
   {
      var x =  keys[i];
      binData[i] = data[x];
   }

   for(var j = 0; j < keys.length; j++)     //taking all the bins ids and storing
   {
      var y =  keys[j];
      binIds[j] = data[y].payload_fields.hardware_id;
   }

     const unique = (value, index, self) => {
     return self.indexOf(value) === index;
   }
    const uniqueIds = binIds.filter(unique);      //Taking unique binIds

    var count = 0;
    var bin = [];


    for(var i = 0; i < uniqueIds.length; i++)
    {
      var first=0;
      for(var k = 0; k < binData.length; k++)
      {
        if(binData[k].payload_fields.hardware_id == uniqueIds[i])
        {
          if(first==0)
          {
            biggest = binData[k];
            first = 1;
          }
          else if(binData[k].metadata.time >= biggest.metadata.time)
          {
              biggest = binData[k];
          }
          else if( binData[k].payload_fields.level <= 24)
          {
            biggest = binData[k];
          }
        }
      }
      bin[i] = biggest;
    }

        let promiseToGetUsers =  new Promise(function(resolve, reject){
        notificationUsers.once("value", function(snapshot){
        var data = snapshot.val();
        var keys = Object.keys(data);
        //console.log( data);
        for(var i = 0; i < keys.length; i++)
        {
          var k =  keys[i];
          user[i] = data[k];        //Storing the users in the array from object
        }
        resolve(user);
      });
    });


    promiseToGetUsers.then(function(user){
      var count = 0;
      var lowLevel = [];
      for(var i = 0; i < bin.length; i++)
      {
        if(bin[i].payload_fields.level <= 24)
        {
          lowLevel[i] = bin[i];
        }
      }

        var filteredLowLevel = lowLevel.filter(function (el) {
        return el != null;
        });
        console.log(filteredLowLevel);
        function sendMail(id, level)
        {
          for(let j = 0; j < user.length; j++)
          {
              msg.to = user[j].email;
              msg.text = `This is to inform you that BIN ID ${id} has ${level}% space left`;
              //console.log(location);
              smtpTransport.sendMail(msg, function(err){
              if(!err)
              {
                console.log("inside");
                console.log(`BIN ID ${id} has ${level}% space left`);
                console.log('Sending to ' + to.email + ' success: ');
              }
            });
            notifications.push({
            email: user[j].email,
            status: msg.status,
            message: `BIN ID ${id} is ${level}% left `
          });
         }
        }


        for(let i = 0; i < filteredLowLevel.length; i++)
        {
          var id = filteredLowLevel[i].payload_fields.hardware_id;
          var level = Math.round((filteredLowLevel[i].payload_fields.level/120)*100);
          let promiseToSendMail =  new Promise(function(resolve, reject){
              sendMail(id, level);
              resolve("yes");
          });
          promiseToSendMail.then(function(x){
            console.log(x);
          });
        }

    });
  });
*/


readBin.on("value", function(snapshot) {
 var data = snapshot.val();
 var keys = Object.keys(data);
 var binData = [];
 var binIds = [];
 for(var i = 0; i < keys.length; i++)
 {
    var x =  keys[i];
    binData[i] = data[x];
 }

 for(var j = 0; j < keys.length; j++)     //taking all the bins ids and storing
 {
    var y =  keys[j];
    binIds[j] = data[y].payload_fields.hardware_id;
 }

   const unique = (value, index, self) => {
   return self.indexOf(value) === index;
 }
  const uniqueIds = binIds.filter(unique);      //Taking unique binIds
  //console.log("Unique ids: " + uniqueIds);

  var count = 0;
  var bin = [];




  for(var i = 0; i < uniqueIds.length; i++)
  {
    var first = 0;
    for(var k = 0; k < binData.length; k++)
    {
      if(binData[k].payload_fields.hardware_id == uniqueIds[i])
      {
        if(first == 0)
        {
          biggest = binData[k];
          first = 1;
        }
        else if(Date.parse(binData[k].metadata.time) >= Date.parse(biggest.metadata.time))
        {
          biggest = binData[k];
        }
      }
    }
    bin[i] = biggest;
  }
  console.log(bin);
});

console.log(Date.parse("31 October 2018"));

//console.log("31 October 2018" > "1 November 2018");
