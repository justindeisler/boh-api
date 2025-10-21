-- PostgreSQL Initialization Script for BOH Event Management Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE boh_db TO boh_user;

-- Log initialization
SELECT 'BOH Database initialized successfully!' AS status;
