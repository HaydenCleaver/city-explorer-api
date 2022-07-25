const express = require('express');
const server = express();
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();
server.use(cors());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(obj){
    this.date = obj.datetime;
    this.description =
    `Low of ${obj.low_temp}, high of ${obj.high_temp}, with ${obj.weather.description}` ;
  }
}

const handleWeather = (request, response) => {

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&city_name=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}&days=5`;

  axios.get(url).then(res => {
    if (request.query.city_name.toLowerCase() === res.data.city_name.toLowerCase()) {

      let forecastResponse = res.data.data.map(forecast => new Forecast (forecast));
      response.send(forecastResponse);
    }

  })
    .catch((error)=> {
      response.status(404).send(`${error}: City Not Found!`);
    });

};




module.exports = handleWeather;
