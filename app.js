require('dotenv').config()
//console.log(process.env.SECRET_KEY) // remove this after you've confirmed it is working

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const https = require('https');

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  console.log(req.body.location);
  //res.send(req.body.location);
  const loc = req.body.location;
  const apikey = process.env.SECRET_KEY;
  const weatherURL = "https://api.openweathermap.org/data/2.5/weather?id=524901&appid="+apikey+"&q="+loc;
  const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid="+apikey+"&q="+loc;

  //CURRENT WEATHER
  https.get(weatherURL, function(response){
    //console.log(response);
    //console.log(response.statusCode);
    response.on("data",function(data){
      //console.log(data);
      // console.log(JSON.parse(data));
      const weatherData = JSON.parse(data);
      // res.send(weatherData.weather[0].main)
      //console.log("<h1>"+weatherData.weather[0].main+"</h1>");
      // console.log("<h2>"+weatherData.weather.description+"</h2>");
      res.write("<h1>Current Weather Description of "+loc+"</h1>")
      res.write("<p>"+weatherData.weather[0].main+"</p>");
      res.write("<p>"+weatherData.weather[0].description+"</p>");
      // res.send();

    })
  })


  //FORECAST WEATHER
  https.get(forecastURL, function(response){
    // console.log(response);
    //console.log(response.statusCode);
    // res.send(response)
    response.on("data",function(data){
      const forecastData = JSON.parse(data);
      // console.log(forecastData);
      // res.send(forecastData.list.slice(0,5));
      res.write("<h1>NEXT 5 FORECAST of "+loc+"</h1>")
      for(i=0;i<5;i++){
        res.write("<h2> Day "+(i+1)+"</h2>")
        res.write("<p>"+forecastData.list[i].weather[0].main+"</p>")
        res.write("<p>"+forecastData.list[i].weather[0].description+"</p>")
      }
      res.send();

    })

    //res.send();

  })

});

app.listen(3000,function(){
  console.log("Server is listening on Port 3000");
})
