const express = require('express');
const server = express();
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();
server.use(cors());

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const Cache = require('./cache');

class Movies {
  constructor(obj){
    this.original_title = obj.original_title;
    this.overview = obj.overview;
    this.vote_average = obj.vote_average;
    this.vote_count = obj.vote_count;
    this.poster_path = 'https://image.tmdb.org/t/p/w500' + obj.poster_path;
    this.popularity = obj.popularity;
    this.release_date = obj.release_date;
  }

}

const handleMovies = (request, response) => {
  let cacheID = request.query.query;
  let currentDate = Date.now();

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${request.query.query}`;

  if (Cache[cacheID] && (currentDate - Cache[cacheID].timestamp < 40000 )) {
    console.log('Hit');
    return Cache[cacheID].data;
  } else {
    console.log('Miss');
    Cache[cacheID] = {};
    Cache[cacheID].timestamp = currentDate;
    Cache[cacheID].data = axios.get(url).then(res => {
      if (res) {
        let movieList = res.data.results.map(movieObj => new Movies (movieObj));
        response.send(movieList);
      }
    });
  }
  // axios.get(url).then(res => {
  //   if (res) {
  //     let movieList = res.data.results.map(movieObj => new Movies (movieObj));
  //     response.send(movieList);

  //   }
  // })
  //   .catch((error) => {
  //     response.status(404).send(`${error}: Movies Not Found!`);
  //   });
};

module.exports = handleMovies;
