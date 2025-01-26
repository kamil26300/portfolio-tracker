# Portfolio Tracker

## Overview
A full-stack web application for tracking stock portfolios with real-time price updates.

## Prerequisites
- Node.js (v14+ recommended)
- MySQL
- Finnhub API Account

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/kamil26300/portfolio-tracker.git
cd portfolio-tracker
```

### 2. Setup
#### Install Dependencies
```bash
npm install
```

#### Create .env File
Create a `.env` file in the root directory with:
```
DB_NAME=portfolio_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
FINNHUB_API_KEY=your_finnhub_api_key
```

### 3. Get Finnhub API Key
1. Visit [Finnhub.io](https://finnhub.io/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 4. Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE portfolio_db;

DROP TABLE IF EXISTS `Stocks`;

USE `portfolio_db`;

CREATE TABLE `Stocks` (
  `symbol` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `purchasePrice` DECIMAL(10, 2) NOT NULL,
  `currentPrice` DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. Run the Application
#### Start Backend Server
```bash
# In root directory
npm run server
```

#### Start Frontend
```bash
# In root directory
npm run dev
```

## API Endpoints

### Stocks
- `GET /api/stocks`: Retrieve all stocks
- `POST /api/stocks`: Add a new stock
- `PUT /api/stocks/:id`: Update existing stock
- `DELETE /api/stocks/:id`: Delete a stock
- `POST /api/stocks/initialize`: Initialize portfolio with random stocks

### Documentation links
- [Localhost](https://teamspacew.postman.co/workspace/Team-Workspace~7dd438da-19b5-4993-80d5-05ea81e6725f/collection/27561329-92b5686f-4e6e-4a9d-ba1c-69ff808c0f91?action=share&creator=27561329&active-environment=27561329-ef16fe8e-9604-47da-b87c-28d4169a63c1)
- [Render Hosted](https://teamspacew.postman.co/workspace/Team-Workspace~7dd438da-19b5-4993-80d5-05ea81e6725f/collection/27561329-b4367e1f-b96a-462d-97f1-d713bef1052e?action=share&creator=27561329)

## Technologies Used
- Frontend: React, Ant Design, Tailwind CSS
- Backend: Node.js, Express
- Database: MySQL, Sequelize
- API: Finnhub Stock API

## Hosted Links
- [Website / Frontend](https://portfolio-fe-dq3m.onrender.com/)
- [API / Backend](https://portfolio-be-lvyv.onrender.com/)

