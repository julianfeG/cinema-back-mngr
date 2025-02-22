import express, { Request, Response } from "express";
import cinemaService from "../services/cinemaService";

const router = express.Router();

router.get("/movies", async (req: Request, res: Response) => {
  try {
    const movies = await cinemaService.getMovies();
    res.json(movies);
  } catch (error) {
    console.error("Error obteniendo películas:", error);
    res.status(500).json({ message: "Error obteniendo películas", error });
  }
});


router.post("/movies", (req: Request, res: Response) => {
  const { title, duration, classification, genre } = req.body;
  const movie = cinemaService.addMovie(title, duration, classification, genre);
  res.status(201).json(movie);
});

export default router;
