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
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Forecast {
  constructor(obj){
    this.date = obj.datetime;
    this.description =
    `Low of ${obj.low_temp}, high of ${obj.high_temp}, with ${obj.weather.description}` ;
  }
}

server.get('/weather', (request, response)=> {

  console.log(request.query);
  let url = `https://api.weatherbit.io/v2.0/bulk/files/forecasts_daily.csv.gz?key=${WEATHER_API_KEY}&lat=${request.query.latitude}&lon=${request.query.longitude}&days=5`;
  axios.get(url).then(res => {

    // let citySearch = request.query;

    let cityWeather = res.data.data;


    // // let city = data.find(element =>
    // //   element.city_name === data.city_name
    // //   && Math.round(element.lat) === Math.round(data.lat)
    // //   && Math.round(element.lon) === Math.round(data.lon));

    console.log(cityWeather.data.city_name);

    let forecastResponse = cityWeather.data.map(forecast => new Forecast (forecast));
    response.send(forecastResponse);//send weather data back;
    console.log(forecastResponse);

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