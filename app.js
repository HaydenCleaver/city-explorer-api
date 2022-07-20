'use strict';

const express = require('express');
require('dotenv').config();
const data = require('./data/weather.json');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT;

class Forecast {
  constructor(obj){
    this.date = obj.datetime;
    this.description =
    `Low of ${obj.low_temp}, high of ${obj.high_temp}, with ${obj.weather.description}` ;
  }
}

app.get('/weather', (request, response)=> {
  console.log(request.query);

  let citySearch = request.query;

  let city = data.find(element =>
    element.city_name === citySearch.city_name
    && Math.round(element.lat) === Math.round(citySearch.lat)
    && Math.round(element.lon) === Math.round(citySearch.lon));

  console.log(citySearch.city_name);

  if (city) {
    let forecastResponse = city.data.map(forecast => new Forecast (forecast));
    response.send(forecastResponse);
    console.log(forecastResponse);//send weather data back;
  } else {
    response.status(404).send('City not in database');
  }

});

app.get('/error', (request, response)=> {
  throw new Error('Error :(');
});

app.use('*', (error, request, response, next)=> {
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
