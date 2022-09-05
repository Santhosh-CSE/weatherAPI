const request = require('request');
const express = require('express');
const app = express();
app.get('/', function(req, res) {
// Get city name passed in the form
var city = req.query.city;
var request = require('request');
let url = `https://api.openweathermap.org/data/2.5/weather?`
+`q=${city}&appid=7a136a981d423dc95f750eda74e46281`
request({ url: url, json: true }, function (error, response) {
if (error)
{
console.log('Unable to connect to Forecast API');
}
else {
console.log('It is currently '
+ response.body.main.temp
+ ' degrees out.'
);
console.log('The high today in '+city+' is '
+ response.body.main.temp_max
+ ' with a low of '
+ response.body.main.temp_min
);
console.log('Humidity today is '
+ response.body.main.humidity
);
res.send(response.body);
}
})
})
app.listen(3000, function() {
console.log('Weather app listening on port 3000!');
});
