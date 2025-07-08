# Docker Setup for UI AI Chatbot

This document explains how to run the UI AI Chatbot project using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Mode

1. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000

### Development Mode

1. **Run in development mode:**
   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development server:**
   - Frontend: http://localhost:8080

## Services

### Frontend (Production)
- **Port:** 3000
- **Technology:** React + Vite + Nginx
- **Features:**
  - Optimized production build
  - Static file serving with Nginx
  - Gzip compression
  - Security headers
  - SPA routing support

### Frontend (Development)
- **Port:** 8080
- **Technology:** React + Vite dev server
- **Features:**
  - Hot reload
  - Source maps
  - Development tools



## Configuration

### Environment Variables

You can customize the setup by creating a `.env` file:

```env
# Frontend
NODE_ENV=production
VITE_API_URL=http://your-backend-url.com
```

### Nginx Configuration

The `nginx.conf` file includes:
- Static file caching
- Gzip compression
- Security headers
- SPA routing
- API proxy configuration (commented out)

To enable API proxying, uncomment and modify the proxy_pass lines in `nginx.conf`.

## Commands

### Build and Run
```bash
# Production
docker-compose up --build

# Development
docker-compose --profile dev up --build

# Run in background
docker-compose up -d --build
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
```

### Clean Up
```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Health Checks

The frontend service includes health checks:
- Frontend: http://localhost:3000/health

## Troubleshooting

### Port Conflicts
If ports 3000 or 8080 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Build Issues
If you encounter build issues:

1. **Clear Docker cache:**
   ```bash
   docker system prune -a
   ```

2. **Rebuild without cache:**
   ```bash
   docker-compose build --no-cache
   ```

### Permission Issues
On Linux, you might need to run with sudo:
```bash
sudo docker-compose up --build
```

## Customization

### Adding Backend API (Optional)
If you want to add a backend API later:
1. Create a `backend/` directory
2. Add your backend code and `requirements.txt`
3. Uncomment the proxy configuration in `nginx.conf`
4. Add a backend service to `docker-compose.yml`

### Changing Base Images
Modify the `FROM` statements in the Dockerfiles:
- `Dockerfile`: Production build
- `Dockerfile.dev`: Development server

### Adding Database
Add a database service to `docker-compose.yml`:

```yaml
database:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: chatbot
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - app-network
```

## Security Notes

- The nginx configuration includes security headers
- Production builds are optimized and minified
- Development mode should not be used in production
- Consider using secrets management for sensitive data

## Performance

- Production builds use multi-stage Docker builds
- Static assets are cached for 1 year
- Gzip compression is enabled
- Nginx is optimized for serving static files 