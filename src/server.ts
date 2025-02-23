import serverless from "aws-serverless-express";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

let handler;

if (process.env.AWS_EXECUTION_ENV) {
  const server = serverless.createServer(app);
  handler = (event: APIGatewayProxyEvent, context: Context) => {
    return serverless.proxy(server, event, context);
  };
} else {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export { handler };