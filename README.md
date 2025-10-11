# University Management Platform - Sprint 1 (Auth)

This workspace contains a simple authentication microservice (Node/Express) and a React frontend for Sprint 1: Accounts & Authentication.

Backend (d/backend):
- Node 18+, Express, MySQL (mysql2), bcrypt, JWT
- Copy `backend/.env.example` to `backend/.env` and update values (DB credentials, JWT secrets).
- Install and run:
  - npm install
  - npm run dev

Frontend (d/frontend):
- React 18 app (simple demo). Set `REACT_APP_API_BASE` to your backend base URL if needed.
- Install and run with your preferred React toolchain (create-react-app expected):
  - npm install
  - npm start

Database (MySQL / XAMPP):
- If you're starting fresh, SQL schema and a small users table are in `db/users_table.sql`.
- This repository also includes a full dump `db/gestion_universitaire.sql` (existing DB). It defines a `gestion_universitaire` database and a `utilisateur` table (columns: id, nom, prenom, email, role, login, mdp_hash).
- Import via MySQL CLI: `mysql -u root -p < db/gestion_universitaire.sql` (or use phpMyAdmin in XAMPP).

Tests:
- Backend tests use Jest + supertest. From `backend` run `npm test`.

Notes:
- Refresh tokens are stored in-memory for demo. In production store them in DB/Redis and use httpOnly cookies.
- Password hashes in the SQL file are placeholders; prefer creating users via the register endpoint to ensure proper hashing.




Super user : admin 
superadmin@example.com
SuperAdmin!2025