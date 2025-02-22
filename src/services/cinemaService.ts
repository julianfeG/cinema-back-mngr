import pool from "../config/db";
import { Movie } from "../interfaces/Movie";


let movies: Movie[] = [{
    id: 1,
    title: "The Shawshank Redemption",
    duration: "2h 22min",
    classification: "R",
    genre: "Drama"
}];

const getMovies = async () => {
    return (await pool.query("SELECT * FROM cinema.movie")).rows;
  };
  

const addMovie = (title: string, duration: string, classification: string, genre: string): Movie => {
    const newMovie: Movie = { id: movies.length + 1, title, duration, classification, genre };
    movies.push(newMovie);
    return newMovie;
};

export default { getMovies, addMovie };
