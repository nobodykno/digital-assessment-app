# Digital Asset Management (DAM)

A Digital Asset Management application for uploading, storing, managing, and processing digital assets. The application supports image and video processing through background workers and provides a REST API for asset management.

## Features

The project provides the following features:

* User authentication
* Digital asset upload and management
* Image processing
* Video processing
* Image and video thumbnail generation
* Background job processing
* Object storage using MinIO
* Asynchronous processing using RabbitMQ
* REST API
* Swagger API documentation
* Database migrations and seeders
* Unit and integration testing
* Docker-based development and deployment
* Nginx reverse proxy
* Docker Swarm configuration

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express
* TypeScript
* Sequelize
* PostgreSQL
* Zod
* JWT
* Winston
* Morgan

### Background Processing

* RabbitMQ
* Image Worker
* Video Worker
* FFmpeg
* Sharp

### Storage

* MinIO
* S3-compatible object storage

### Infrastructure

* Docker
* Docker Compose
* Docker Swarm
* Nginx

### Testing

* Jest
* Supertest
* Unit Tests
* Integration Tests

### API Documentation

* Swagger / OpenAPI

## Prerequisites

Before setting up the project, make sure the following are installed:

* Node.js 22+
* pnpm 11+
* Docker
* Docker Compose

## Project Setup

### 1. Install Dependencies

Install all project dependencies from the repository root:


pnpm install


### 2. Environment Configuration

Create and configure the required environment files for the application.

The environment configuration should include the required settings for:

* PostgreSQL
* MinIO
* RabbitMQ
* Backend API
* Frontend
* Image Worker
* Video Worker

Make sure all required environment variables are configured before starting the application.

### 3. Start the Application

Start all services using Docker Compose:


docker compose up


To start the application in detached mode:


docker compose up -d


### 4. Build Docker Containers

To build all Docker images:


docker compose build


To build the images and start the application:


docker compose up --build


## PNPM Workspace Commands

The project uses a PNPM workspace.

To run a script for a specific package:

pnpm --filter <packageName> <scriptName>


For example:


pnpm --filter @dam/api test


This allows commands to be executed for individual packages without running the script across the entire workspace.

## Docker Commands

### Start an Existing Container


docker start <container_name>


### Check Running Containers


docker ps


### Check All Containers

To view both running and stopped containers:


docker ps -a


### Access a Running Container


docker exec -it <container_name> sh


### Stop Docker Compose Services

docker compose down


## Database

Database migrations and seeders are managed through the backend/database package.

Run package-specific database commands using:


pnpm --filter <packageName> <scriptName>


Make sure PostgreSQL is running and the database environment variables are configured before running migrations or seeders.

## Docker Swarm Setup

Docker Swarm is used for deployment and service orchestration.

### 1. Initialize Docker Swarm

docker swarm init


### 2. Create the Overlay Network


docker network create --driver overlay --attachable dam-network


The `dam-network` network allows Swarm services to communicate with each other.

### 3. Deploy the Stack

Deploy the application using the Docker Swarm configuration:


docker stack deploy -c <stack-file>.yml dam


Replace `<stack-file>.yml` with the Docker Swarm configuration file used by the project.

### 4. Check Swarm Services


docker service ls


To inspect a specific service:


docker service ps <service_name>


## Testing

Run tests for a specific package using:


pnpm --filter <packageName> test


The project includes:

* Unit tests
* Integration tests
* API tests

For example:


pnpm --filter @dam/api test


## Linting and Type Checking

Run linting:


pnpm lint


Run TypeScript type checking:


pnpm typecheck


Run the test suite:

pnpm test


## Verification

After starting the application, verify that:

* Docker containers are running successfully.
* PostgreSQL is accessible.
* MinIO is running and accessible.
* RabbitMQ is running.
* Backend API is available.
* Frontend is accessible.
* Image worker is connected to RabbitMQ.
* Video worker is connected to RabbitMQ.
* Background processing jobs are being consumed successfully.
* Nginx is routing requests correctly.
* Swagger API documentation is accessible.
