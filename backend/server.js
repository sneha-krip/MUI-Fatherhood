require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fatherhoodRoutes = require('./routes/fatherhood');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-production-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081', 'http://127.0.0.1:5500', 'null'],
    credentials: true
}));

// Rate limiting for signup endpoint
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: { 
        error: 'Too many signup attempts',
        message: 'Too many signup attempts from this IP, please try again later.'
    }
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/fatherhood', signupLimiter, fatherhoodRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Fatherhood Initiative API',
        timestamp: new Date().toISOString() 
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Man Up! Inc. Fatherhood Initiative API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            signup: 'POST /api/fatherhood/signup',
            signups: 'GET /api/fatherhood/signups'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Fatherhood Initiative Backend                         ║
║   ══════════════════════════════════════════════════════   ║
║                                                            ║
║   Server running on port ${PORT}                             ║
║   Health check: http://localhost:${PORT}/health              ║
║                                                            ║
║   Man Up! Inc. - Empowering Fathers                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;

