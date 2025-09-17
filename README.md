# URL Shortener with Analytics

A scalable URL shortener service with click tracking, built using **FastAPI, PostgreSQL, and Redis**.  
Includes analytics dashboard (React + Tailwind) for link insights.

## 🚀 Features
- Shorten long URLs into Base62 codes
- Track clicks, unique visitors, and timestamps
- Cache hot links with Redis
- REST API + optional React frontend
- Designed with scalability in mind (load balancing, sharding)

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL, Redis (cache)
- **Frontend**: React + Tailwind (optional)
- **Deployment**: Docker, Heroku/Vercel/AWS

## 📂 Architecture
![Architecture Diagram](docs/architecture.png)

## ⚡ Getting Started
```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener

# Setup backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
