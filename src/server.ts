import { app } from "./app";
import { connectToDatabase } from "./connection/dbConn";

connectToDatabase()


const port = process.env.PORT || 8005;

app.listen(port, async () => {
  console.log('Server is running on port ' + port);
});

process.on('unhandledRejection', (error: Error) => {
  console.log(error.name, error.message);
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.log('Process terminated!');
  process.exit(1);
});
