import pool from "../config/db";
import { Movie } from "../interfaces/Movie";
import { ReservedSeat } from "../interfaces/ReservedSeat";
import { sendEmail } from "./emailService";

const getReservedSeats = async (showTimeId: string) => {
    console.log("INIT TO getReservedSeats with showTimeId: ", showTimeId);
    return (await pool.query(`SELECT rs.seat_row, rs.seat_column FROM cinema.reserved_seat rs JOIN cinema.reservation r ON rs.reservation_id = r.id WHERE r.showtime_id = ${showTimeId}`)).rows;
};

const getMoviesShowtime = async () => {
    console.log("INIT TO getMoviesShowtime");
    const [moviesResult, showtimeResult] = await Promise.all([
        pool.query('SELECT * FROM cinema.movie'),
        pool.query('SELECT * FROM cinema.showtime')
    ]);

    const movies = moviesResult.rows;
    const showtimes = showtimeResult.rows;

    const moviesWithShowtimes = movies.map(movie => ({
        ...movie,
        showtimes: showtimes.filter(showtime => showtime.movie_id === movie.id)
    }));
    return moviesWithShowtimes;
};

const getReservations = async () => {
    console.log("INIT TO getReservations");

    const query = `
        SELECT 
            m.title AS movie_title,
            s.theater_id,
            s.datetime,
            r.email,
            r.uuid,
            json_agg(
                json_build_object('seat_row', rs.seat_row, 'seat_column', rs.seat_column)
            ) AS reservedSeats
        FROM cinema.reservation r
        JOIN cinema.showtime s ON r.showtime_id = s.id
        JOIN cinema.movie m ON s.movie_id = m.id
        LEFT JOIN cinema.reserved_seat rs ON r.id = rs.reservation_id
        GROUP BY m.title, s.theater_id, s.datetime, r.email, r.uuid;
    `;

    const { rows } = await pool.query(query);
    return rows;
};

const saveReservation = async (body: { uuid: string; showtimeId: string; email: string; reservedSeats: ReservedSeat[] }) => {
    const { uuid, showtimeId, email, reservedSeats } = body;
    console.log("INIT TO saveReservation with body: ", body);
    const reservationQuery = `INSERT INTO cinema.reservation (uuid, showtime_id, email, created_date) VALUES ($1, $2, $3, NOW()) RETURNING id`;
    const reservationValues = [uuid, showtimeId, email];
    const reservationId = await pool.query(reservationQuery, reservationValues);
    console.log('reservationId:',reservationId.rows[0].id);

    const query = `
    INSERT INTO cinema.reserved_seat (reservation_id, seat_row, seat_column)
    VALUES ${reservedSeats.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(", ")}
    RETURNING *;
    `;

    const values = [reservationId.rows[0].id, ...reservedSeats.flatMap(seat => [seat.seatRow, seat.seatColumn])];
    const result = await pool.query(query, values);
    console.log('Inserted seats:', result.rows);

    sendEmail({
        to: email,
        from: "felipetapsandes2@gmail.com",
        templateId: "d-6d90dc0c791f42158a2c7b979423475b",
        dynamicTemplateData: {
            username: "Julian",
            orderId: "ABC123",
            orderDate: "2025-02-22",
          },
    });
    return { reservationId: reservationId.rows[0].id };
}

const getInfo = async (searchParam: string) => {
    console.log("INIT TO getInfo with searchParam: ", searchParam);
    return (await pool.query(`SELECT * FROM cinema.${searchParam}`)).rows;
};
  
const insertInfo = async (searchParam: string, body: any) => {
    console.log("INIT TO insertInfo with searchParam:", searchParam, "and body:", body);

    const columns = Object.keys(body).join(", ");
    const values = Object.values(body);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO cinema.${searchParam} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    return (await pool.query(query, values)).rows[0];
};

const deleteById = async (tableName: string, id: string) => {
    console.log(`INIT TO deleteById: Table = ${tableName}, ID = ${id}`);
    const query = `DELETE FROM cinema.${tableName} WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
        return  result.rowCount !== null && result.rowCount > 0 
            ? { success: true, deleted: result.rows[0] } 
            : { success: false, message: "No se encontró el registro" };
};

const updateById = async (searchParam: string, id: string, body: any) => {
    console.log("INIT TO updateById: Table =", searchParam, "ID =", id, "Body =", body);
    if (!body || Object.keys(body).length === 0) {
        return { success: false, message: "El cuerpo de la solicitud está vacío" };
    }
    const columns = Object.keys(body);
    const values = Object.values(body);
    const setQuery = columns.map((col, index) => `${col} = $${index + 1}`).join(", ");
    const query = `UPDATE cinema.${searchParam} SET ${setQuery} WHERE id = $${columns.length + 1} RETURNING *;`;
    const result = await pool.query(query, [...values, id]);
        return result.rowCount !== null && result.rowCount > 0
            ? { success: true, updated: result.rows[0] }
            : { success: false, message: "No se encontró el registro para actualizar" };
};



export default { getInfo, insertInfo, deleteById, updateById, getReservedSeats, getMoviesShowtime, saveReservation, getReservations };
