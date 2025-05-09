
# Woovi Leaky Bucket Challenge

## Overview
This project implements a token bucket rate-limiting solution based on the [Woovi Leaky Bucket Challenge](https://github.com/woovibr/jobs/blob/main/challenges/woovi-leaky-bucket-challenge.md). It adheres to the Bacen (Central Bank of Brazil) rules for key reading operations, utilizing a token bucket algorithm to manage request rates. The project is built using **Node.js**, **Koa** for the API framework, and **Redis** for storing token bucket state.

## Features
- Implements a token bucket rate-limiting algorithm.
- Configurable for any route, though only two routes are exposed in this implementation.
- Follows Bacen-compliant key reading rules.
- Lightweight and scalable with Redis for persistence.

## Tech Stack
- **Node.js**: Runtime environment.
- **Koa**: HTTP middleware framework for building APIs.
- **Redis**: In-memory data store for managing token bucket state.
- **Docker**: Containerization for running Redis.
- **PNPM**: Package manager for Node.js dependencies.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies using PNPM:
   ```bash
   pnpm install
   ```

3. Set up Redis using Docker:
   Ensure Docker is installed, then run:
   ```bash
   docker compose up -d
   ```
   This starts a Redis container in detached mode.

4. Verify Redis is running (default port: 6379).

## Running the Project
1. Start the application in development mode:
   ```bash
   pnpm dev
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints
The project exposes the following routes for testing the token bucket implementation via **Postman** or similar tools:

### Entries
- **POST /entries**: Create a new entry. Consumes tokens from the bucket.
- **GET /entries**: Retrieve entries. Also subject to rate limiting.

### Buckets
- **GET /buckets**: Retrieve the current state of the token bucket.

## Token Bucket Configuration
The token bucket algorithm is implemented to be flexible and reusable across any route. Configuration options include:
- **Bucket capacity**: Maximum number of tokens the bucket can hold.
- **Refill rate**: Rate at which tokens are added to the bucket over time.
- **Key prefix**: Unique identifier for each bucket (e.g., per user or per route).

These settings can be adjusted in the codebase to suit different use cases.

## Testing
To test the rate-limiting functionality:
1. Use **Postman** or another API client to send requests to the `/entries` and `/buckets` endpoints.
2. Monitor the token bucket state via the `/buckets` endpoint.
3. Simulate high-frequency requests to observe rate-limiting in action.

Example:
- Send multiple `POST /entries` requests in quick succession to exhaust tokens.
- Check the `/buckets` response to verify token depletion and refill over time.

## Notes
- The token bucket algorithm is designed to be reusable for any route by adjusting the middleware configuration.
- Ensure Docker and Node.js are installed to run Redis and the application.
- The implementation prioritizes simplicity and compliance with the Bacen rules for key reading.

