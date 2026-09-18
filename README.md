# Salon Appointment Booking System

## 📖 Project Description
A full-stack, responsive luxury Salon Appointment Booking and Management System. Designed to provide a seamless scheduling experience, this application empowers salon administrators to manage active services and gives customers the ability to book appointments in specific time slots without the risk of double booking.

## ✨ Features
- **Service Management**: Full CRUD operations for salon services, including dynamic price and duration tracking.
- **Intelligent Appointment Booking**: Robust conflict prevention prevents multiple bookings for the same service and time slot.
- **Status Tracking**: Appointments flow through a lifecycle: `Pending` ➔ `Confirmed` ➔ `Completed` (or `Cancelled`).
- **Responsive UI**: A modern "Glassmorphism" design system utilizing a dark-mode palette with warm gold accents.
- **Direct SQL Initialization**: Uses pure raw SQL scripts to bootstrap the database schema and seed initial data.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS3
- **Backend**: Python, Django, Django REST Framework (DRF) using purely Function-Based Views (FBVs)
- **Database**: SQLite
- **Architecture**: Decoupled Client-Server (REST API)

## 📂 Project Folder Structure
```text
appointment-booking/
├── backend/                  # Python/Django API
│   ├── api/                  # Application Logic (Views, Models, URLs)
│   ├── salon_backend/        # Django settings and routing
│   ├── db.sqlite3            # SQLite database file
│   └── manage.py             # Django entry point
├── frontend/                 # React.js UI (Vite)
│   ├── public/               # Static assets
│   ├── src/                  # React Components, Hooks, API services
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite compiler settings
├── sql/                      # Standalone SQL execution
│   ├── init_db.py            # Python automation to run SQL 
│   ├── schema.sql            # Table DDL & Constraints
│   └── seed.sql              # Initial Dummy Data (Nepalese Salon Data)
└── README.md                 # Project Documentation
```

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Python 3.8+**
- **Node.js 16+** and **npm**

## 🌐 Frontend Installation and Run Commands
Navigate into the `frontend` directory and start the Vite development server:
```bash
cd frontend

# Install all JavaScript dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will be accessible at: **http://localhost:5173**

## ⚙️ Backend Installation and Run Commands
Open a new terminal window, navigate to the `backend` directory, and start the Django server:
```bash
cd backend

# Install required Python dependencies (if not using a global environment)
pip install django djangorestframework django-cors-headers

# Apply existing migrations to sync Django's internal state
python manage.py migrate

# Start the development API server
python manage.py runserver
```
The backend API will be accessible at: **http://127.0.0.1:8000**

## 🗄️ Database Setup / Schema Instructions
The project uses SQLite and raw SQL `.sql` files for table structures. To set up or completely reset the database to a fresh state with sample seed data, run the provided Python initialization script from the root directory:

```bash
# Run this from the root directory of the project
python sql/init_db.py
```
*Note: This script directly drops tables, executes `sql/schema.sql` to rebuild them, and inserts dummy data using `sql/seed.sql`.*

## 🔐 Environment Variables
**No `.env` file is required for local testing.**
- The application defaults to connecting to the local SQLite database (`backend/db.sqlite3`).
- CORS rules are pre-configured in `settings.py` to allow traffic from `http://localhost:5173`.

## 📡 API Endpoints

### Services
- `GET /api/services` - List all salon services
- `POST /api/services` - Create a new service (Validates Name, Price > 0, Duration > 0)
- `PUT /api/services/<id>` - Update an existing service
- `DELETE /api/services/<id>` - Remove a service

### Appointments
- `GET /api/appointments` - List appointments (Accepts optional `?status=...` query)
- `POST /api/appointments` - Book an appointment (Checks for conflicting time slots)
- `PATCH /api/appointments/<id>/status` - Update appointment status (Pending/Confirmed/Completed/Cancelled)
- `DELETE /api/appointments/<id>` - Delete an appointment entirely

## 🚀 How to use the application
1. Open up the React Frontend (`http://localhost:5173`).
2. **Services Tab**: View, add, or alter available salon services.
3. **Appointments Tab**: Book an appointment by entering a customer name, phone number, selecting an available service, and choosing a future date/time. 
4. Attempt to book the *same service* at the *same time* for a different user—the system will block it to prevent double-booking.
5. Manage appointments by changing their real-time statuses (e.g., from `Pending` to `Completed`).

## 🔑 Test Credentials
**None required.** 
For the scope of this project and ease of assessment, user authentication/authorization (login/signup) has intentionally been bypassed. All API endpoints and UI pathways are openly accessible.

## 🖼️ Screenshots
*(Add screenshots of your application interfaces here prior to submission)*

![Dashboard Preview](./frontend/public/vite.svg)
> *Replace this with your actual Dashboard screenshot (`![Title](path/image.png)`)*

## ⚠️ Known Limitations
- The system currently supports a single practitioner/branch. Multiple locations or staff members are not tracked.
- Real-time live updates (WebSockets) are absent; manual frontend refresh is required on secondary browsers to view new appointments.
- No role-based access control (Customers vs. Admins see the same UI).

## 🎯 Assessment Requirements Mapping
- **DRF Function Based Views**: Implemented in `backend/api/views.py` (`@api_view`).
- **Database Schema & SQL Constraints**: Defined entirely in `sql/schema.sql`.
- **Conflict Checking Logic**: Handled elegantly within the POST `/api/appointments` view to guarantee no double bookings.
- **Frontend Interaction**: React.js hooks used dynamically and effectively in `frontend/src/`.

## 👤 Author / Contact Information
- **Name**: [Your Name]
- **Student ID**: [Your ID]
- **Email**: [Your Email]
- **GitHub**: [github.com/your-username]
