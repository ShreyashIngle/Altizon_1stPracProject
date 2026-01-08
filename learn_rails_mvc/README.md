# Learn Rails MVC

## Project Title
**Learn Rails MVC**

## Description
This is a Ruby on Rails application designed to demonstrate the MVC architecture. It typically serves as a backend or a full-stack application. This project uses **MongoDB** as its database, integrating it via the **Mongoid** ODM (Object-Document Mapper) instead of the traditional PostgreSQL/SQLite with ActiveRecord.

**Ruby on Rails** is a server-side web application framework written in Ruby under the MIT License. Rails is a model–view–controller (MVC) framework, providing default structures for a database, a web service, and web pages.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Ruby** (Version 3.2.0 or higher recommended)
- **Rails** (Version 8.1.1)
- **Docker & Docker Compose** (For running MongoDB and Portainer)
- **Node.js & Yarn** (For managing JavaScript dependencies)

## Installing Rails
If you haven't installed Rails yet, follow these steps:

1.  **Install Ruby**: Use a version manager like `rbenv` or `rvm`.
    ```bash
    # Example using rbenv
    rbenv install 3.3.0
    rbenv global 3.3.0
    ```
2.  **Install Rails**:
    ```bash
    gem install rails -v 8.1.1
    ```

## Creating the Project
This project was likely created with the following command to skip the default Active Record setup (since we use Mongoid):
```bash
rails new learn_rails_mvc --skip-active-record --css tailwind
```

## Installing Dependencies
To set up the project dependencies, run:

1.  **Install Ruby Gems**:
    ```bash
    bundle install
    ```
2.  **Install JavaScript Packages**:
    ```bash
    npm install
    # or
    yarn install
    ```

## Folder Structure
Here is an overview of the key folders in this Rails project:

-   `app/`: Contains the core application code (Models, Views, Controllers, Jobs, Mailers).
    -   `app/models/`: Mongoid documents (database models) go here.
    -   `app/controllers/`: Request handling logic.
    -   `app/views/`: HTML templates (ERB).
    -   `app/javascript/`: JavaScript files.
-   `config/`: Configuration files (routes, database, application settings).
    -   `config/mongoid.yml`: MongoDB connection configuration.
    -   `config/routes.rb`: URL routing definitions.
-   `db/`: Database migrations and seeds (though Mongoid is schemaless, seeds still go here).
-   `public/`: Static files (images, compiled assets).
-   `test/`: Unit and integration tests.
-   `Gemfile`: List of Ruby gem dependencies.
-   `docker-compose.yml`: Definition for Docker services (MongoDB, Portainer).

## Running the Application
To start the application locally:

1.  **Start the Database** (Ensure Docker is running):
    ```bash
    docker-compose up -d
    ```
2.  **Start the Rails Server**:
    ```bash
    bin/rails server
    ```
    Open your browser and visit `http://localhost:3000`.

## Database Setup
This project uses **MongoDB** running in a Docker container. We also use **Portainer** for managing the Docker environment visually.

### Docker Compose Setup
Ensure your `docker-compose.yml` includes services for MongoDB and Portainer:

```yaml
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  portainer:
    image: portainer/portainer-ce:latest
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

volumes:
  mongodb_data:
  portainer_data:
```

### Steps to Run
1.  **Start Services**: `docker-compose up -d`
2.  **Access Portainer**: Open `http://localhost:9000` to manage your containers.
3.  **Mongoid Configuration**: The `config/mongoid.yml` file connects to `localhost:27017`. Ensure this matches your Docker setup.

## Common Commands
-   `bin/rails server` or `bin/rails s`: Start the web server.
-   `bin/rails console` or `bin/rails c`: Open the Rails console for interacting with the app.
-   `bin/rails generate scaffold <ModelName> field:type`: Generate a new resource (Model, View, Controller).
-   `bin/rails routes`: List all defined routes.
-   `bin/rails test`: Run the test suite.

## Testing
This project uses the default Rails testing framework (Minitest). 
To run all tests:
```bash
bin/rails test
```

## Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/my-feature`).
3.  Commit your changes (`git commit -m "Add my feature"`).
4.  Push to the branch (`git push origin feature/my-feature`).
5.  Open a Pull Request.
