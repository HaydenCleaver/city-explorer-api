'use strict';

const express = require('express');
const server = express();
const cors = require('cors');

require('dotenv').config();
server.use(cors());

const PORT = process.env.PORT;
const handleWeather = require('./weather');
const handleMovies = require('./movies');

server.get('/weather', (request, response)=> {
  handleWeather(request, response);

});

server.get('/movies', (request, response) => {
  handleMovies(request, response);

});

server.use('*', (error, request, response, next)=> {
  response.status(500).send(error);
});

server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

// https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY
// https://api.weatherbit.io/v2.0/bulk/files/forecasts_daily.csv.gz?key=YOUR_KEY