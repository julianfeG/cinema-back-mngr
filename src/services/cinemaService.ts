import { ReservedSeat } from "../interfaces/ReservedSeat";
import { sendEmail } from "./emailService";
import { queries, executeQuery } from "../database/dbQueries";

export const getReservedSeats = async (showTimeId: string) => {
    console.log("Fetching reserved seats for showTimeId:", showTimeId);
    return await executeQuery(queries.getReservedSeats, [showTimeId]);
};

export const getMoviesShowtime = async () => {
    console.log("Fetching movies with showtimes...");
    const movies = await executeQuery(queries.getAllFromTable("movie"));
    const showtimes = await executeQuery(queries.getAllFromTable("showtime"));

    return movies.map(movie => ({
        ...movie,
        showtimes: showtimes.filter(showtime => showtime.movie_id === movie.id),
    }));
};

export const getReservations = async () => {
    console.log("Fetching all reservations...");
    return await executeQuery(queries.getReservations);
};

export const getInfo = async (tableName: string) => {
    console.log(`Fetching all records from ${tableName}...`);
    return await executeQuery(queries.getAllFromTable(tableName));
};

export const insertIntoTable = async (tableName: string, data: any) => {
    console.log(`Inserting into ${tableName}:`, data);
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    return await executeQuery(queries.insertIntoTable(tableName, columns, placeholders), values);
};

export const updateById = async (tableName: string, id: string, data: any) => {
    console.log(`Updating ${tableName}, ID: ${id}, Data:`, data);
    
    if (!data || Object.keys(data).length === 0) {
        return { success: false, message: "El cuerpo de la solicitud está vacío" };
    }

    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "id")
    );

    if (Object.keys(filteredData).length === 0) {
        return { success: false, message: "No hay datos válidos para actualizar" };
    }

    const columns = Object.keys(filteredData);
    const values = Object.values(filteredData);
    const setQuery = columns.map((col, i) => `${col} = $${i + 2}`).join(", ");
    
    const result = await executeQuery(queries.updateById(tableName, setQuery), [id, ...values]);

    return result.length > 0 
        ? { success: true, updated: result[0] } 
        : { success: false, message: "No se encontró el registro" };
};


export const deleteById = async (tableName: string, id: string) => {
    console.log(`Deleting from ${tableName}, ID: ${id}`);
    const result = await executeQuery(queries.deleteById(tableName), [id]);
    return result.length > 0 ? { success: true, deleted: result[0] } : { success: false, message: "No se encontró el registro" };
};

export const saveReservation = async (body: { uuid: string; showtimeId: string; email: string; reservedSeats: ReservedSeat[] }) => {
    console.log("Saving new reservation:", body);
    const { uuid, showtimeId, email, reservedSeats } = body;

    await sendEmail({
        to: email,
        from: "felipetapsandes2@gmail.com",
        templateId: "d-6d90dc0c791f42158a2c7b979423475b",
        dynamicTemplateData: {
            reservedSeats: formatReservedSeats(reservedSeats)
        }
    });

    const reservationResult = await insertIntoTable("reservation", { uuid, showtime_id: showtimeId, email, created_date: new Date() });
    const reservation = reservationResult[0];

    const seatValues = [reservation.id, ...reservedSeats.flatMap(seat => [seat.seatRow, seat.seatColumn])];
    const seatQuery = queries.insertReservedSeats(reservedSeats.length);

    await executeQuery(seatQuery, seatValues);

    return { reservationId: reservation.id };
};

const formatReservedSeats = (reservedSeats: ReservedSeat[]): string => {
    return reservedSeats
        .map(seat => `${String.fromCharCode(65 + parseInt(seat.seatRow, 10))}${seat.seatColumn}`)
        .join(",");
};
