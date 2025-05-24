import { app } from "./app";
import { connectToDatabase } from "./connection/dbConn";

const startServer = async () => {
  try {
    await connectToDatabase();
    
    const port = process.env.PORT || 8005;

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Health check available at: http://localhost:${port}/api/v1/health`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Add better error logging
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Top level error:', error);
  process.exit(1);
});
