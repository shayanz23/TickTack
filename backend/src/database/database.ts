import "dotenv/config";
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL as string, {
  // host                 : '',            // Postgres ip address[s] or domain name[s]
  // port                 : 5432,          // Postgres server port[s]
  // database             : '',            // Name of database to connect to
  // username             : '',            // Username of database user
  // password             : '',            // Password of database user
})

export default sql;