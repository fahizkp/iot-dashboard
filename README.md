# Sample App Template

A modern full-stack application template with **React**, **Express**, and **MongoDB**. Use this as a starting point for building your own applications.

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- React Hook Form for forms
- Axios for API calls

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Helmet, CORS, and rate limiting

**DevOps:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx reverse proxy
- Traefik integration (production)

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (optional, for containerized development)
- MongoDB (local or remote)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git my-app
cd my-app
```

### 2. Rename the App

Replace all occurrences of "sample" with your app name:

```bash
# On macOS/Linux
find . -type f \( -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.jsx" -o -name "*.html" -o -name "*.conf" \) -exec sed -i '' 's/sample/myapp/g' {} +

# On Linux (without '')
find . -type f \( -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.jsx" -o -name "*.html" -o -name "*.conf" \) -exec sed -i 's/sample/myapp/g' {} +
```

Or manually update these files:
- `client/package.json` - package name
- `server/package.json` - package name and description
- `docker-compose.yml` - service names, container names
- `docker-compose.dev.yml` - service names, container names
- `nginx.conf` - API proxy reference
- `.github/workflows/deploy.yml` - image names, paths

### 3. Configure Environment

**Server:**
```bash
cp server/.env.sample server/.env
```

Edit `server/.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secure-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2a$10$your-bcrypt-hash
```

Generate a bcrypt hash for the admin password:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

**Client:**
```bash
cp client/.env.example client/.env
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server && pnpm install && cd ..

# Install client dependencies
cd client && pnpm install && cd ..
```

### 5. Run Development Server

**Option A: Run directly (requires local MongoDB)**

```bash
# Terminal 1 - Start the API
cd server && pnpm dev

# Terminal 2 - Start the client
cd client && pnpm dev
```

**Option B: Run with Docker**

```bash
docker compose -f docker-compose.dev.yml up
```

The app will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000

## Production Deployment

### 1. Update Configuration

Replace placeholders in `docker-compose.yml`:
- `<your-username>` - Your GitHub username
- `<your-app>` - Your app name
- `<your-domain>` - Your domain

Replace placeholders in `.github/workflows/deploy.yml`:
- `<your-username>` - Your GitHub username
- `<your-app>` - Your app name
- `<your-deploy-path>` - Server path (e.g., `/srv/myapp`)

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:
- `SSH_HOST` - Deployment server hostname
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key
- `SSH_PORT` - SSH port (usually 22)
- `GHCR_TOKEN` - GitHub Container Registry token

### 3. Build & Push Images

Push to the `release` branch to trigger the CI/CD pipeline:

```bash
git checkout -b release
git push origin release
```

### 4. Manual Deployment (Alternative)

Build images locally:
```bash
docker build -t myapp:latest -f Dockerfile .
docker build -t myapp-api:latest -f Dockerfile.api .
```

Run on server:
```bash
docker compose up -d
```

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── main.jsx        # Entry point
│   ├── Dockerfile.dev      # Dev container
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── .env.sample         # Environment template
│   └── package.json
│
├── .github/workflows/      # GitHub Actions
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── Dockerfile              # Frontend production
├── Dockerfile.api          # Backend production
└── nginx.conf              # Nginx configuration
```

## Environment Variables

### Server

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiry (default: 8h) | No |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin password (bcrypt hash) | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment mode | No |
| `CORS_ORIGIN` | Allowed CORS origin | No |

### Client

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No |

## Features

- User authentication with JWT
- Admin login panel
- Contact form submissions
- Responsive design
- Docker-ready development
- Production-ready deployment

## License

MIT
