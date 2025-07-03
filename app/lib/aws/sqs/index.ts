import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const {
  AWS_REGION = "ap-northeast-1",
  AWS_ACCESS_KEY_ID = "",
  AWS_SECRET_ACCESS_KEY = "",
  SQS_ENDPOINT_URL,
} = process.env;

const client = new SQSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  ...(SQS_ENDPOINT_URL
    ? { endpoint: SQS_ENDPOINT_URL, useQueueUrlAsEndpoint: true }
    : {}),
});

export async function enqueueToSqs({
  queueUrl,
  messageBody,
}: {
  queueUrl: string;
  messageBody: string;
}): Promise<void> {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error("failed to enqueue message:", error);
    throw error;
  }
}
