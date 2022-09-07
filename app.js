const redis = require('redis');
const request = require('request'); 
const express = require('express');
const app = express();
const redisPort = 6379
const client = redis.createClient();
client.on("error", (err) => {
    console.log(err);
});
let API_KEY = '7a136a981d423dc95f750eda74e46281'; 
  let stringify;
  app.get('/', async(req,res)=> {
    if(!req.query.city){
      const message = 'Invalid Request';
        res.status(403).send(message);
    }

    var resp = await getdatafromRedis(req.query.city);
    //console.log("value from redis", resp); process.exit(0);
    if(resp != null){
        res.status(200).send(resp)
    }else{
       getDatafromAPI(req.query.city, (err, resp) => {
            if(err){
                res.send(err);
            }else{
                res.status(200).send(resp);
            }
        });
    }
})
  
app.listen(3000,async ()=> {
    await client.connect();
    console.log('Weather app listening on port 3000!');
});

async function getdatafromRedis(city){
    console.log("I'm in redis function");
    const result = await client.get(city);
    if(result !=null){
        return JSON.parse(result);
    } else {
        return null;
    }
    }

 function getDatafromAPI(city,callback){
    console.log("I'm in api function");
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=" + API_KEY;
    request({ url:url, json: true },(error, response)=> { 
        if (error) 
        {  
            callback({"msg":"error"},null); 
        } 
          else { 
            client.set(city,JSON.stringify({"temp":response.body.main.temp}));
     //console.log('It is currently ' + response.body.main.temp+ ' degrees out.'  ); 
      //  console.log('The high today in '+city+' is ' + response.body.main.temp_max + ' with a low of '+ response.body.main.temp_min ); 
           // console.log('Humidity today is ' + response.body.main.humidity  ); 
            callback (null, {"temp":response.body.main.temp});
            
        } 
    });
 }
