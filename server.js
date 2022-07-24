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

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&city_name=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}&days=5`;
  let citySearch = request.query;

  axios.get(url).then(res => {

    // let city = res.data.find(element =>
    //   element.city_name.toLowerCase() === citySearch.city_name.toLowerCase()
    //   && Math.round(element.lat) === Math.round(citySearch.lat)
    //   && Math.round(element.lon) === Math.round(citySearch.lon));

    console.log(res.data);
    console.log(citySearch.city_name.toLowerCase === res.data.city_name.toLowerCase);

    if (citySearch.city_name.toLowerCase() === res.data.city_name.toLowerCase()) {
      console.log(Forecast);
      let forecastResponse = res.data.map(forecast => new Forecast (forecast));
      console.log('complete?');
      response.send(forecastResponse);//send weather data back;
      console.log(forecastResponse);
    }

  })
    .catch((error) => {
      response.status(500).send(error);
    });


});

server.use('*', (error, request, response, next)=> {
  response.status(500).send(error);
});

server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

// https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY
// https://api.weatherbit.io/v2.0/bulk/files/forecasts_daily.csv.gz?key=YOUR_KEY