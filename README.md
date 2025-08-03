# Fuck-leetcode-Backend

A Node.js backend service for automating LeetCode problem solving with AI assistance.

## Features

- Automated LeetCode problem synchronization
- User progress tracking
- Google Sheets integration for waitlist management
- RESTful API endpoints
- MongoDB integration
- Winston logging
- Express.js with comprehensive middleware

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom middleware
- **Logging**: Winston
- **External APIs**: LeetCode API, Google Sheets API

## Environment Variables

Create a `.env` file based on `.env.example`:

### Required Variables
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Admin Authentication
ADMIN_SECRET_KEY=your_secure_admin_secret_key
```

### Optional Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

# Google Sheets (for waitlist features)
GOOGLE_SPREADSHEET_ID=your_google_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_KEY=your_google_service_account_json_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# API Version
API_VERSION=v1
```

## Deployment on Vercel

### Prerequisites
1. MongoDB Atlas account (or any MongoDB hosting service)
2. Vercel account
3. Google Service Account (optional, for waitlist features)

### Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd Fuck-leetcode-Backend
   npm install
   ```

2. **Set Environment Variables in Vercel**
   
   In your Vercel dashboard, go to Project Settings > Environment Variables and add:
   
   **Required:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `ADMIN_SECRET_KEY`: A secure random string for admin authentication
   
   **Optional:**
   - `GOOGLE_SPREADSHEET_ID`: Google Sheets ID for waitlist
   - `GOOGLE_SERVICE_ACCOUNT_KEY`: JSON string of your Google service account key
   - `CORS_ORIGIN`: Your frontend domain (e.g., https://yourapp.vercel.app)
   - `NODE_ENV`: Set to "production"

3. **Deploy**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Tasks
- `GET /api/v1/tasks?apiKey=USER_API_KEY` - Get next problem for user
- `POST /api/v1/tasks/result?apiKey=USER_API_KEY` - Report task completion

### Admin
- `POST /api/v1/admin/sync-problems` - Sync problems from LeetCode (requires admin key)

### Waitlist
- `GET /api/v1/waitlist/count` - Get waitlist count
- `POST /api/v1/waitlist/add` - Add email to waitlist

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Populate Database (First Time)**
   ```bash
   # Use the admin endpoint to sync problems
   curl -X POST http://localhost:3000/api/v1/admin/sync-problems \
   -H "x-secret-key: your_admin_secret_key"
   ```

## Production Considerations

### Database
- Use MongoDB Atlas or a managed MongoDB service
- Set up proper indexes for performance
- Consider read replicas for high traffic

### Security
- Use strong, unique values for `ADMIN_SECRET_KEY`
- Keep your Google Service Account key secure
- Enable MongoDB authentication and network restrictions

### Monitoring
- Monitor logs through Vercel's dashboard
- Set up alerts for errors
- Monitor database performance

### Scaling
- Vercel automatically scales serverless functions
- Consider database connection pooling for high traffic
- Monitor rate limits and adjust as needed

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see LICENSE file for details