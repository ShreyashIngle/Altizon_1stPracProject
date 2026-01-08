# Rails MVC + React Full-Stack Application

A comprehensive full-stack web application built with Ruby on Rails backend and React frontend, featuring CRUD operations, Elasticsearch-powered search, background job processing with Sidekiq, and containerized services using Docker.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Elasticsearch Integration](#elasticsearch-integration)
- [Sidekiq Background Jobs](#sidekiq-background-jobs)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)

---

## 🎯 Overview

This project demonstrates a modern full-stack application with:
- **Backend**: RESTful API built with Ruby on Rails 8.1.1
- **Frontend**: Responsive React application with Vite and Tailwind CSS
- **Database**: MongoDB with Mongoid ODM
- **Search**: Elasticsearch integration for full-text search
- **Background Jobs**: Sidekiq with Redis for asynchronous processing
- **Containerization**: Docker Compose for service orchestration

---

## ✨ Features

### Core CRUD Operations

The application provides complete CRUD (Create, Read, Update, Delete) functionality for three main resources:

#### 1. **Articles**
- Fields: `title`, `content`
- Full-text search enabled
- Elasticsearch indexing

#### 2. **Books**
- Fields: `title`, `author`, `description`
- Full-text search enabled
- Elasticsearch indexing

#### 3. **Posts**
- Fields: `title`, `body`
- Full-text search enabled
- Elasticsearch indexing

### Additional Features

- **Full-Text Search**: Powered by Elasticsearch on all resources
- **Real-time Updates**: React frontend with instant UI updates
- **Background Processing**: Sidekiq for asynchronous job execution
- **CORS Enabled**: Seamless frontend-backend communication
- **Responsive UI**: Tailwind CSS for modern, mobile-friendly design
- **RESTful API**: Standard REST endpoints for all resources

---

## 🛠 Technology Stack

### Backend
- **Ruby on Rails** 8.1.1 - Web application framework
- **MongoDB** - NoSQL database
- **Mongoid** 9.0 - MongoDB ODM for Rails
- **Puma** - Web server
- **Rack CORS** 3.0 - Cross-Origin Resource Sharing

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **Tailwind CSS** 4.1.18 - Utility-first CSS framework
- **Axios** (via fetch API) - HTTP client

### Containerized Services (Docker Compose)

#### 1. **MongoDB**
- **Image**: `mongo:latest`
- **Port**: `27017`
- **Purpose**: Primary database for storing Articles, Books, and Posts
- **Volume**: `mongodb_data:/data/db` (persistent storage)

#### 2. **Redis**
- **Image**: `redis:alpine`
- **Port**: `6379`
- **Purpose**: Message broker for Sidekiq background jobs
- **Volume**: `redis_data:/data` (persistent storage)
- **Configuration**: AOF (Append-Only File) persistence enabled

#### 3. **Elasticsearch**
- **Image**: `docker.elastic.co/elasticsearch/elasticsearch:8.11.1`
- **Port**: `9200`
- **Purpose**: Full-text search engine for all resources
- **Configuration**: 
  - Single-node cluster
  - Security disabled for development
  - 512MB heap size
- **Volume**: `esdata:/usr/share/elasticsearch/data`

#### 4. **Portainer** (Optional - Currently Commented Out)
- **Image**: `portainer/portainer-ce:latest`
- **Port**: `9000`
- **Purpose**: Docker container management UI
- **Note**: Uncomment in `docker-compose.yml` to enable

### Background Processing
- **Sidekiq** - Background job processor
- **Sidekiq-Scheduler** - Scheduled/recurring jobs support

### Search & Indexing
- **Elasticsearch** 8.11.1 - Search engine
- **Elasticsearch-Model** - Rails integration for Elasticsearch

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│                    Port: 5173 (default)                     │
│              Tailwind CSS + React Components                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Ruby on Rails Backend (Puma)                   │
│                       Port: 3000                            │
│          Articles, Books, Posts Controllers                 │
└──┬──────────────┬──────────────┬──────────────┬────────────┘
   │              │              │              │
   ▼              ▼              ▼              ▼
┌─────────┐  ┌─────────┐  ┌──────────────┐  ┌─────────┐
│ MongoDB │  │  Redis  │  │Elasticsearch │  │ Sidekiq │
│Port:    │  │Port:    │  │Port: 9200    │  │ Worker  │
│27017    │  │6379     │  │              │  │         │
└─────────┘  └─────────┘  └──────────────┘  └─────────┘
   (Data)     (Queue)        (Search)         (Jobs)
```

---

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Ruby**: 3.x or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: 20.x or higher
- **Docker Compose**: 2.x or higher
- **Git**: For version control

### Verify Installations

```bash
ruby --version
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
cd /home/test/Desktop/Shreyash_Altizon
```

### Step 2: Start Docker Services

Start all containerized services (MongoDB, Redis, Elasticsearch):

```bash
cd learn_rails_mvc
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

You should see:
- `mongodb` on port 27017
- `redis` on port 6379
- `elasticsearch` on port 9200

### Step 3: Backend Setup (Rails)

#### Install Ruby Dependencies

```bash
cd learn_rails_mvc
bundle install
```

#### Configure Database

The application uses MongoDB via Mongoid. Configuration is in `config/mongoid.yml`.

#### Create and Setup Database

```bash
# MongoDB doesn't require migrations like SQL databases
# Collections are created automatically when first accessed
```

#### Create Elasticsearch Indices

```bash
# Start Rails console
bin/rails console

# Create indices for all models
Article.__elasticsearch__.create_index! force: true
Book.__elasticsearch__.create_index! force: true
Post.__elasticsearch__.create_index! force: true

# Import existing data (if any)
Article.import
Book.import
Post.import

# Exit console
exit
```

### Step 4: Frontend Setup (React)

```bash
cd ../react_frontend
npm install
```

---

## 🎮 Running the Application

You need to start three separate processes:

### Terminal 1: Rails Server

```bash
cd learn_rails_mvc
bin/rails server
```

**Access**: http://localhost:3000

### Terminal 2: Sidekiq Worker

```bash
cd learn_rails_mvc
bundle exec sidekiq
```

**Purpose**: Processes background jobs from Redis queue

### Terminal 3: React Frontend

```bash
cd react_frontend
npm run dev
```

**Access**: http://localhost:5173 (default Vite port)

### Quick Start Script

Alternatively, you can run all services in the background:

```bash
# Start Docker services
cd learn_rails_mvc
docker-compose up -d

# Start Rails (in background)
bin/rails server &

# Start Sidekiq (in background)
bundle exec sidekiq &

# Start React frontend
cd ../react_frontend
npm run dev
```

---

## 📡 API Documentation

All API endpoints follow RESTful conventions and return JSON responses.

### Base URL

```
http://localhost:3000
```

### Articles Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/articles` | List all articles | - |
| GET | `/articles/:id` | Get single article | - |
| POST | `/articles` | Create new article | `{ "article": { "title": "...", "content": "..." } }` |
| PATCH/PUT | `/articles/:id` | Update article | `{ "article": { "title": "...", "content": "..." } }` |
| DELETE | `/articles/:id` | Delete article | - |
| GET | `/articles/search?q=query` | Search articles | - |

### Books Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/books` | List all books | - |
| GET | `/books/:id` | Get single book | - |
| POST | `/books` | Create new book | `{ "book": { "title": "...", "author": "...", "description": "..." } }` |
| PATCH/PUT | `/books/:id` | Update book | `{ "book": { "title": "...", "author": "...", "description": "..." } }` |
| DELETE | `/books/:id` | Delete book | - |
| GET | `/books/search?q=query` | Search books | - |

### Posts Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/posts` | List all posts | - |
| GET | `/posts/:id` | Get single post | - |
| POST | `/posts` | Create new post | `{ "post": { "title": "...", "body": "..." } }` |
| PATCH/PUT | `/posts/:id` | Update post | `{ "post": { "title": "...", "body": "..." } }` |
| DELETE | `/posts/:id` | Delete post | - |
| GET | `/posts/search?q=query` | Search posts | - |

### Example API Requests

#### Create an Article

```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -d '{
    "article": {
      "title": "My First Article",
      "content": "This is the content of my article"
    }
  }'
```

#### Search Books

```bash
curl http://localhost:3000/books/search?q=ruby
```

#### Update a Post

```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "post": {
      "title": "Updated Title",
      "body": "Updated content"
    }
  }'
```

---

## 🔍 Elasticsearch Integration

### Overview

All three models (Article, Book, Post) are integrated with Elasticsearch for powerful full-text search capabilities.

### Features

- **Automatic Indexing**: Records are automatically indexed on create/update
- **Multi-field Search**: Search across multiple fields simultaneously
- **English Analyzer**: Optimized for English language text
- **Real-time Updates**: Index updates happen via callbacks

### Configuration

Each model includes:

```ruby
include Elasticsearch::Model
include Elasticsearch::Model::Callbacks
```

### Index Settings

- **Shards**: 1 (suitable for development)
- **Analyzer**: English
- **Dynamic Mapping**: Disabled (explicit field mapping)

### Search Implementation

#### Article Search
Searches across: `title`, `content`

#### Book Search
Searches across: `title`, `author`, `description`

#### Post Search
Searches across: `title`, `body`

### Manual Index Management

#### Reindex All Data

```bash
bin/rails console

# Reindex Articles
Article.__elasticsearch__.create_index! force: true
Article.import

# Reindex Books
Book.__elasticsearch__.create_index! force: true
Book.import

# Reindex Posts
Post.__elasticsearch__.create_index! force: true
Post.import
```

#### Delete an Index

```bash
bin/rails console

Article.__elasticsearch__.delete_index!
```

#### Check Index Status

```bash
# Via curl
curl http://localhost:9200/_cat/indices?v

# Via Rails console
Article.__elasticsearch__.index_exists?
```

### Search Query Examples

```ruby
# In Rails console
Article.search_query("ruby programming")
Book.search_query("tolkien")
Post.search_query("tutorial")
```

---

## ⚙️ Sidekiq Background Jobs

### Overview

Sidekiq is configured for asynchronous job processing using Redis as the message broker.

### Configuration

**Location**: `config/initializers/sidekiq.rb`

**Redis Connection**: 
- URL: `redis://localhost:6379/0`
- Environment variable: `REDIS_URL` (optional override)

### Features

- **Sidekiq Scheduler**: Support for scheduled/recurring jobs
- **Schedule File**: `config/schedule.yml` (if exists)
- **JSON Logging**: Logs available at `log/sidekiq_json.log`

### Running Sidekiq

```bash
cd learn_rails_mvc
bundle exec sidekiq
```

### Monitoring Sidekiq

#### Web UI (Optional)

Add to `config/routes.rb`:

```ruby
require 'sidekiq/web'
mount Sidekiq::Web => '/sidekiq'
```

Access at: http://localhost:3000/sidekiq

#### Command Line

```bash
# View Sidekiq stats
bundle exec sidekiq-info

# View queue status
redis-cli -h localhost -p 6379 llen queue:default
```

### Creating Background Jobs

```ruby
# app/jobs/example_job.rb
class ExampleJob < ApplicationJob
  queue_as :default

  def perform(*args)
    # Job logic here
  end
end

# Enqueue job
ExampleJob.perform_later(arg1, arg2)
```

---

## 📁 Project Structure

### Backend (learn_rails_mvc)

```
learn_rails_mvc/
├── app/
│   ├── controllers/
│   │   ├── articles_controller.rb    # Articles CRUD + Search
│   │   ├── books_controller.rb       # Books CRUD + Search
│   │   └── posts_controller.rb       # Posts CRUD + Search
│   ├── models/
│   │   ├── article.rb                # Article model + Elasticsearch
│   │   ├── book.rb                   # Book model + Elasticsearch
│   │   └── post.rb                   # Post model + Elasticsearch
│   └── jobs/
│       └── application_job.rb        # Base job class
├── config/
│   ├── initializers/
│   │   └── sidekiq.rb                # Sidekiq configuration
│   ├── mongoid.yml                   # MongoDB configuration
│   └── routes.rb                     # API routes
├── docker-compose.yml                # Docker services definition
├── Gemfile                           # Ruby dependencies
└── log/
    └── sidekiq_json.log              # Sidekiq logs
```

### Frontend (react_frontend)

```
react_frontend/
├── src/
│   ├── services/
│   │   └── articleService.js         # API service layer
│   ├── App.jsx                       # Main app component
│   ├── ArticleList.jsx               # Articles CRUD UI
│   ├── BookList.jsx                  # Books CRUD UI
│   ├── PostList.jsx                  # Posts CRUD UI
│   ├── WelcomeMessage.jsx            # Welcome component
│   └── main.jsx                      # App entry point
├── index.html                        # HTML template
├── package.json                      # Node dependencies
├── tailwind.config.js                # Tailwind configuration
└── vite.config.js                    # Vite configuration
```

---

## 🔧 Development Commands

### Docker Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View service logs
docker-compose logs -f [service_name]

# Restart a specific service
docker-compose restart mongodb

# Remove all containers and volumes
docker-compose down -v
```

### Rails Commands

```bash
# Start Rails console
bin/rails console

# Check routes
bin/rails routes

# Run database seeds (if any)
bin/rails db:seed

# Clear logs
bin/rails log:clear

# Run tests
bin/rails test
```

### Elasticsearch Commands

```bash
# Check cluster health
curl http://localhost:9200/_cluster/health?pretty

# List all indices
curl http://localhost:9200/_cat/indices?v

# View index mapping
curl http://localhost:9200/articles/_mapping?pretty

# Delete all data from an index
curl -X POST http://localhost:9200/articles/_delete_by_query?conflicts=proceed \
  -H 'Content-Type: application/json' \
  -d '{"query": {"match_all": {}}}'
```

### Redis Commands

```bash
# Connect to Redis CLI
docker exec -it redis redis-cli

# View all keys
KEYS *

# Monitor real-time commands
MONITOR

# Check queue length
LLEN queue:default

# Flush all data (CAUTION!)
FLUSHALL
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🎯 Quick Reference

### Service Ports

| Service | Port | Access URL |
|---------|------|------------|
| Rails API | 3000 | http://localhost:3000 |
| React Frontend | 5173 | http://localhost:5173 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Redis | 6379 | redis://localhost:6379 |
| Elasticsearch | 9200 | http://localhost:9200 |
| Portainer (optional) | 9000 | http://localhost:9000 |

### Environment Variables

```bash
# Redis URL (optional override)
export REDIS_URL=redis://localhost:6379/0

# Rails environment
export RAILS_ENV=development
```

---

## 📝 Notes

- **Portainer** is currently commented out in `docker-compose.yml`. Uncomment to enable Docker management UI.
- **Kafka** is not currently implemented in this project (mentioned in initial request but not found in codebase).
- All models use **MongoDB** with **Mongoid ODM** instead of ActiveRecord.
- **CORS** is enabled to allow React frontend to communicate with Rails backend.
- **Elasticsearch** indices are created automatically on first model save, but manual creation is recommended for production.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 🆘 Troubleshooting

### Docker Services Won't Start

```bash
# Check if ports are already in use
sudo lsof -i :27017
sudo lsof -i :6379
sudo lsof -i :9200

# Remove old containers
docker-compose down -v
docker-compose up -d
```

### Elasticsearch Connection Issues

```bash
# Check Elasticsearch is running
curl http://localhost:9200

# Recreate indices
bin/rails console
Article.__elasticsearch__.create_index! force: true
```

### Sidekiq Not Processing Jobs

```bash
# Check Redis connection
redis-cli ping

# Restart Sidekiq
pkill -f sidekiq
bundle exec sidekiq
```

### Frontend Can't Connect to Backend

- Verify CORS is enabled in Rails
- Check Rails server is running on port 3000
- Verify API URLs in frontend service files

---

**Happy Coding! 🚀**
