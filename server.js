'use strict';

const express = require('express');
const server = express();
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();
// const data = require('./data/weather.json');
server.use(cors());

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(obj){
    this.date = obj.datetime;
    this.description =
    `Low of ${obj.low_temp}, high of ${obj.high_temp}, with ${obj.weather.description}` ;
  }
}

server.get('/weather', (request, response)=> {

  console.log(request.query);

  let url = `https://api.weatherbit.io/v2.0/bulk/files/forecasts_daily.csv.gz?key=${WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}&days=5`;
  let citySearch = request.query;

  axios.get(url).then(res => {

    let city = res.find(element =>
      element.city_name === citySearch.city_name
      && Math.round(element.lat) === Math.round(citySearch.lat)
      && Math.round(element.lon) === Math.round(citySearch.lon));

    console.log(res.city_name);

    if (city) {
      let forecastResponse = city.data.map(forecast => new Forecast (forecast));
      response.send(forecastResponse);//send weather data back;
      console.log(forecastResponse);

    } else {
      response.status(404).send('City not in database');
    }

  })
    .catch((error) => {
      response.status(500).send(error);
    });


});

server.get('/error', (request, response)=> {
  throw new Error('Error :(');
});

server.use('*', (error, request, response, next)=> {
  response.status(500).send(error);
});

server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

// https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY
// https://api.weatherbit.io/v2.0/bulk/files/forecasts_daily.csv.gz?key=YOUR_KEY