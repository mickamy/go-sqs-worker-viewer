import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
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
