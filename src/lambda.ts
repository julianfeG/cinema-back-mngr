import { APIGatewayProxyEvent, Context } from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  console.log("LAMBDA EVENT: ", event);
  return awsServerlessExpress.proxy(server, event, context);
};
