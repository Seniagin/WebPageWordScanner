import { APIGatewayEvent } from 'aws-lambda';
import { crawler } from "./src/crawler";

export const handler = async (event: APIGatewayEvent) => {
  const { site, word, depth } = event.queryStringParameters;
  const crawlResults = await crawler(site, word, depth);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      {
        crawlResults
      },
      null,
      2
    ),
  };
};
