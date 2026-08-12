# Digital Asset Management (DAM)

A Digital Asset Management application for uploading, storing, managing, and processing digital assets. The application supports image and video processing through background workers and provides a REST API for asset management.

# Features

The project provides following features

- User authentication
- Digital asset upload and management
- Image processing
- Video processing
- Image and video thumbnail generation
- Background job processing
- Object storage using MinIO
- Asynchronous processing using RabbitMQ
- REST API
- Swagger API documentation
- Database migrations and seeders
- Unit and integration testing
- Docker-based development and deployment
- Nginx reverse proxy
- Docker Swarm configuration

# TechStack

Frontend

React
TypeScript
Vite
Tailwind CSS
React Router

Backend

Node.js
Express
TypeScript
Sequelize
PostgreSQL
Zod
JWT
Winston
Morgan

Background Processing
RabbitMQ
Image Worker
Video Worker
FFmpeg
Sharp

Storage

MinIO
S3-compatible object storage

Infrastructure

Docker
Docker Compose
Docker Swarm
Nginx

Testing

Jest
Supertest
Unit Tests
Integration Tests
API Documentation
Swagger / OpenAPI

# Prerequisites

Node.js 22+
pnpm 11+
Docker
Docker Compose


# Commands 

 - Install all packages

  pnpm install

- To access different package and its script files
  
  pnpm --filter packageName scriptName

- Useful Docker commands for project
 
   docker compose up -> To start all containers

   docker compose build -> To build all container

   docker start existing container  name -> To start existing container

   docker exec -it container_name sh  ->  To execute inside container

   docker ps -> To check all running service

   docker ps -a -> To show all service failed also

   docker compose up -d -> To run container in background

   docker network create --driver overlay --attachable dam-network -> To create network for docke swarm

   docker swarm init -> to init docker swarm

- Architecture




