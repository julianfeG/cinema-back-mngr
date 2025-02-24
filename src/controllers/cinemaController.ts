import express, { Request, Response } from "express";
import * as cinemaService from "../services/cinemaService";

const router = express.Router();

router.get("/reservedSeats/:showTimeId", async (req: Request, res: Response) => {
  try {
    const { showTimeId } = req.params;
    const seats = await cinemaService.getReservedSeats(showTimeId);
    res.json(seats);
  } catch (error) {
    console.error("Error obteniendo asientos:", error);
    res.status(500).json({ message: "Error obteniendo asientos", error });
  }
});

router.get("/moviesShowtime", async (req: Request, res: Response) => {
  try {
    const response = await cinemaService.getMoviesShowtime();
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo peliculas:", error);
    res.status(500).json({ message: "Error obteniendo peliculas", error });
  }
});

router.get("/reservations", async (req: Request, res: Response) => {
  try {
    const response = await cinemaService.getReservations();
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo reservas:", error);
    res.status(500).json({ message: "Error obteniendo reservas", error });
  }
});

router.get("/:searchParam", async (req: Request, res: Response) => {
  try {
    const { searchParam } = req.params;
    const result = await cinemaService.getInfo(searchParam);
    res.json(result);
  } catch (error) {
    console.error("Error obteniendo información:", error);
    res.status(500).json({ message: "Error obteniendo información", error });
  }
});

router.post("/reservation", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const response = await cinemaService.saveReservation(body);
    res.json(response);
  } catch (error) {
    console.error("Error haciendo reserva:", error);
    res.status(500).json({ message: "Error haciendo reserva", error });
  }
});

router.post("/:searchParam", async (req: Request, res: Response) => {
  try {
    const { searchParam } = req.params;
    const body = req.body;
    const result = await cinemaService.insertIntoTable(searchParam, body);
    res.json(result);
  } catch (error) {
    console.error("Error añadiendo información:", error);
    res.status(500).json({ message: "Error añadiendo información", error });
  }
});

router.delete("/:table/:id", async (req: Request, res: Response) => {
  try {
    const { table, id } = req.params;
    const result = await cinemaService.deleteById(table, id);
    res.json(result);
  } catch (error) {
    console.error("Error borrando información:", error);
    res.status(500).json({ message: "Error borrando información", error });
  }
});

router.put("/:searchParam/:id", async (req: Request, res: Response) => {
  try {
    const { searchParam, id } = req.params;
    const body = req.body;
    const result = await cinemaService.updateById(searchParam, id, body);
    res.json(result);
  } catch (error) {
    console.error("Error actualizando información:", error);
    res.status(500).json({ message: "Error actualizando información", error });
  }
});

export default router;
