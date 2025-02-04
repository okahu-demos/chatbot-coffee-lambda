import { logger } from '@/libs/Logger';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'; // Import AWS SDK Lambda client

export const POST = async (request: Request) => {
  const sessionId = request.headers.get('X-Session-Id');
  logger.info(`Processing request for session: ${sessionId}`);
  
  const client = new LambdaClient({
    region: 'us-east-1', credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3 || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3 || ''
    }
  }); // Initialize Lambda client
  const json = await request.json()
  console.log(json)
  const id: string = uuidv4();
  const lambdaRequestJson = {
    ...json,
    requestId: id,
    sessionId: sessionId
  };
  console.log(lambdaRequestJson)
  const command = new InvokeCommand({
    FunctionName: process.env.AWS_LAMBDA_FUNC_NAME, // Replace with your Lambda function name
    Payload: JSON.stringify(lambdaRequestJson),
  });

  try {
    const response = await client.send(command);
    // console.log("response", response)
    const responsePayload = new TextDecoder('utf-8').decode(response.Payload);
    // console.log("responsePayload", responsePayload)
    return NextResponse.json(JSON.parse(JSON.parse(responsePayload).body));
  } catch (error) {
    logger.error(`Error invoking lambda function: ${error}`);
    return NextResponse.json({ error: 'Failed to invoke lambda function' }, { status: 500 });
  }
};
