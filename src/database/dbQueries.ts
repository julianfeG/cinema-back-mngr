import pool from "../config/db";

export const queries = {
    getAllFromTable: (tableName: string) => `SELECT * FROM cinema.${tableName};`,

    insertIntoTable: (tableName: string, columns: string, placeholders: string) => 
        `INSERT INTO cinema.${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`,

    updateById: (tableName: string, setQuery: string) => 
        `UPDATE cinema.${tableName} SET ${setQuery} WHERE id = $1 RETURNING *;`,

    deleteById: (tableName: string) => `DELETE FROM cinema.${tableName} WHERE id = $1 RETURNING *;`,

    getReservedSeats: `
        SELECT rs.seat_row, rs.seat_column 
        FROM cinema.reserved_seat rs 
        JOIN cinema.reservation r ON rs.reservation_id = r.id 
        WHERE r.showtime_id = $1;
    `,

    getReservations: `
        SELECT 
            m.title AS movie_title,
            s.theater_id,
            s.datetime,
            r.email,
            r.uuid,
            json_agg(json_build_object('seat_row', rs.seat_row, 'seat_column', rs.seat_column)) AS reservedSeats
        FROM cinema.reservation r
        JOIN cinema.showtime s ON r.showtime_id = s.id
        JOIN cinema.movie m ON s.movie_id = m.id
        LEFT JOIN cinema.reserved_seat rs ON r.id = rs.reservation_id
        GROUP BY m.title, s.theater_id, s.datetime, r.email, r.uuid;
    `,

    insertReservedSeats: (seatCount: number) => `
        INSERT INTO cinema.reserved_seat (reservation_id, seat_row, seat_column)
        VALUES ${Array.from({ length: seatCount }, (_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(", ")}
        RETURNING *;
    `,
};

export const executeQuery = async (query: string, values: any[] = []) => {
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database query failed");
    }
};
