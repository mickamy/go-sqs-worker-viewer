# go-sqs-worker-viewer

go-sqs-worker-viewer is a web application designed to monitor and manage asynchronous jobs handled
by [go-sqs-worker](https://github.com/mickamy/go-sqs-worker).

This application features a dashboard to display job success and failure rates, along with a categorized list of jobs by
their status (e.g., queued, processing, success, failed). It provides an intuitive interface for tracking and analyzing
job processing.

## How to Use

Integrating go-sqs-worker-viewer into your application that uses go-sqs-worker is straightforward. Below is an example
configuration using docker compose:

```yaml
  viewer:
    image: mickamy/go-sqs-worker-viewer
    environment:
      - REDIS_URL=redis://:password@redis:6379/0
    ports:
      - "3000:3000"
    networks:
      - default
```

After setting up, the application will be accessible at http://localhost:3000, providing real-time insights into job
processing and status updates.

## License

This project is licensed under the MIT License.

