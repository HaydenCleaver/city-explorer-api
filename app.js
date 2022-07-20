'use strict';

const express = require('express');
const data = require('./data/weather.json');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT;

class Forecast {
  constructor(date, description){
    this.date = date;
    this.description = description;
  }

  forecast (object) {
    let dailyForecast =
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
    response.send('city found!'); //send weather data back;
  } else {
    response.status(404).send('City not in database');
  }

});

app.get('/error', (request, response)=> {
  throw new Error('Error :(');
});

app.use('*', (error, request, response)=> {
  response.send(500).send(error);
});

app.listen(3000, () => {
  console.log(`Server is running on Port: 3000`);
});
