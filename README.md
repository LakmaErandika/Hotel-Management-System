# Ceylon Heights Hotel – Hotel Management System

A full-stack hotel management and booking web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Guests can browse rooms, check availability for their dates, book, and pay. Hotel staff manage rooms, bookings, guest messages and site content from an admin view.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Setup and Installation](#setup-and-installation)
6. [Creating an Admin Account](#creating-an-admin-account)
7. [Running the Application](#running-the-application)
8. [CRUD Coverage](#crud-coverage)
9. [API Endpoints](#api-endpoints)
10. [Database Design](#database-design)
11. [Security and Validation](#security-and-validation)
12. [Troubleshooting](#troubleshooting)
13. [Known Limitations and Future Work](#known-limitations-and-future-work)

---

## Features

### Guest view
- Register and log in (JWT authentication)
- Browse all rooms with photos, descriptions, facilities and prices
- Open a room details page
- Search rooms by check-in and check-out dates (rooms already booked for those dates are hidden)
- Book a room with adult and children counts (validated against the room's maximum occupancy)
- Dummy payment gateway with card number, expiry date and CVV validation
- View own bookings, pay for unpaid bookings, cancel unpaid bookings
- Post reviews with a 1–5 star rating
- Send messages to the hotel and read the hotel's replies
- Chatbot for common questions (bookings, payments, check-in times and so on)

### Admin (management) view
- Add, edit, delete and reorder rooms
- View all bookings, with guest and room details
- Delete unpaid bookings (paid bookings are locked)
- Read, reply to, mark as read and delete guest messages
- Edit the About, Facilities, Gallery and Contact details pages directly in the browser
- Delete inappropriate reviews
- Admins cannot send contact messages

### General
- Role-based access control on both the API and the frontend routes
- Responsive layout with a mobile hamburger menu
- Rule-based FAQ chatbot widget (no external API needed)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Tools | Git and GitHub, Postman, nodemon |

---

## Project Structure

```
Hotel Management System/
├── BACKEND/
│   ├── Middleware/
│   │   └── auth.js              # verifyToken, verifyAdmin, optionalAuth
│   ├── Models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── ContactMessage.js
│   │   └── SiteContent.js
│   ├── Routes/
│   │   ├── Auth.js
│   │   ├── Rooms.js
│   │   ├── Bookings.js
│   │   ├── Reviews.js
│   │   ├── ContactMessages.js
│   │   └── Content.js
│   ├
│   ├── package.json
│   └── server.js
├── FRONTEND/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ChatBot, ProtectedRoute
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # Home, RoomDetails, BookRoom, Payment, ...
│   │   ├── services/            # api.js (Axios instance with token interceptor)
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── docs/
│   ├── ER Diagram         
│   
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (this project was developed on v24)
- npm (included with Node.js)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (optional, for testing the API and creating the admin account)

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/LakmaErandika/Hotel-Management-System.git
cd Hotel-Management-System
```

### 2. Set up MongoDB Atlas

1. Create a cluster in MongoDB Atlas.
2. Under **Security → Database Access**, create a database user and note the username and password.
3. Under **Security → Network Access**, add your IP address (or `0.0.0.0/0` for development only).
4. Click **Connect → Drivers** and copy your connection string.


### 3. Configure the backend

```bash
cd BACKEND
pnpm install
```

Create a file named `.env` in the `BACKEND` folder.

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-host>/Hotel_db?retryWrites=true&w=majority
PORT=8870
JWT_SECRET=replace_this_with_a_long_random_string
```

| Variable | Description |
|---|---|
| `MONGODB_URL` | MongoDB Atlas connection string, including the database name `Hotel_db` |
| `PORT` | Port the API listens on (default `8870`) |
| `JWT_SECRET` | Secret used to sign login tokens. Use a long random value. |


### 4. Configure the frontend

```bash
cd ../FRONTEND
pnpm install
```

The frontend talks to the API at `http://localhost:8870`. If you change the backend port, update `baseURL` in `FRONTEND/src/services/api.js`.

---

## Creating an Admin Account

The public registration form creates **guest** accounts only, so nobody can promote themselves to admin from the website. Create the first admin through the API.

With the backend running, send this request in Postman:

```
POST http://localhost:8870/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "choose-a-strong-password",
  "phone": "0770000000",
  "role": "admin"
}
```

Then log in on the website with that email and password. The navbar will show the admin links (Add Room, Manage Bookings, Messages).


---

## Running the Application

Open two terminals.

**Terminal 1 – Backend**

```bash
cd BACKEND
pnpm run dev
```

Expected output:

```
Server is up and running on port number: 8870
MongoDB connection success!
```

**Terminal 2 – Frontend**

```bash
cd FRONTEND
pnpm run dev
```

Open **http://localhost:5173** in your browser.

### Suggested first-run walkthrough

1. Register an admin (see above) and log in.
2. Add a few rooms, with photo URLs, facilities and max occupancy.
3. Log out, register a guest account and log in.
4. On the Rooms page, pick dates and click **Check Availability**.
5. Open a room, click **Book This Room**, enter guest counts, then pay with any valid-looking test card (for example `4111111111111111`, a future expiry like `12/29`, CVV `123`).
6. Check **My Bookings**, then log in as admin to see the booking under **Manage Bookings**.

---

## CRUD Coverage

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| **Rooms** | Admin adds a room | List, search by dates, details page | Admin edits a room, reorders rooms | Admin deletes a room |
| **Bookings** | Guest books a room | Guest: own bookings. Admin: all bookings | Payment confirmation, cancellation | Admin deletes unpaid bookings |
| **Users** | Registration | Login and profile in token | – | – |
| **Reviews** | Guest posts a review | Public list | – | Owner or admin deletes |
| **Contact messages** | Guest or visitor sends | Admin inbox, guest's own thread | Admin reply and mark as read | Admin deletes |
| **Site content** | Created on first save | Public pages | Admin edits About, Facilities, Gallery, Contact | – |

---

## API Endpoints

Base URL: `http://localhost:8870`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in and receive a JWT |

### Rooms
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/room` | Public | All rooms, in admin-defined order |
| GET | `/room/search?checkInDate=&checkOutDate=` | Public | Rooms free for the given dates |
| GET | `/room/get/:id` | Public | One room |
| POST | `/room/add` | Admin | Add a room |
| PUT | `/room/update/:id` | Admin | Update a room |
| PUT | `/room/reorder` | Admin | Move a room up or down |
| DELETE | `/room/delete/:id` | Admin | Delete a room |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/booking/add` | Logged in | Create a booking (checks dates and occupancy) |
| GET | `/booking/my-bookings` | Logged in | The caller's bookings |
| GET | `/booking` | Admin | All bookings |
| PUT | `/booking/confirm-payment/:id` | Owner | Mark as paid |
| PUT | `/booking/cancel/:id` | Owner | Cancel (blocked once paid) |
| PUT | `/booking/update-status/:id` | Admin | Change status (blocked once paid) |
| DELETE | `/booking/delete/:id` | Admin | Delete (blocked once paid) |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/review` | Public | All reviews |
| POST | `/review/add` | Logged in | Post a review |
| DELETE | `/review/delete/:id` | Owner or admin | Delete a review |

### Contact messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/contact/add` | Public (not admin) | Send a message |
| GET | `/contact/my-messages` | Guest | Own messages and replies |
| GET | `/contact` | Admin | All messages |
| PUT | `/contact/reply/:id` | Admin | Reply to a message |
| PUT | `/contact/read/:id` | Admin | Mark as read |
| DELETE | `/contact/delete/:id` | Admin | Delete a message |

### Site content
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/content/:key` | Public | Page content (`about`, `facilities`, `gallery`, `contactInfo`) |
| PUT | `/content/:key` | Admin | Save page content |

---

## Database Design

The database has six collections. Every document has an `_id` primary key plus `createdAt` and `updatedAt` timestamps.

| Collection | Key fields | Relationships |
|---|---|---|
| `users` | name, email (unique), password (hashed), phone, role | One user has many bookings, reviews and messages |
| `rooms` | roomNumber (unique), type, pricePerNight, maxOccupancy, isAvailable, description, facilities[], imageUrl, order | One room has many bookings |
| `bookings` | guest (FK), room (FK), checkInDate, checkOutDate, adults, children, status, paymentStatus, totalPrice | Links `users` and `rooms` |
| `reviews` | guest (FK), rating (1–5), comment | Belongs to a user |
| `contactmessages` | guest (FK, optional), name, email, message, read, reply, repliedAt | Optionally belongs to a user |
| `sitecontents` | key (unique), data (JSON) | Standalone |


**Business rules enforced by the server**
- A room cannot be booked for dates that overlap an existing confirmed booking.
- Adults plus children cannot exceed the room's maximum occupancy.
- The total price is calculated on the server (`nights × pricePerNight`), never trusted from the client.
- Paid bookings cannot be cancelled or deleted.
- Guests can only view, pay for and cancel their own bookings.

---

## Security and Validation

- Passwords are hashed with **bcryptjs** before storage.
- Authentication uses **JWT** (1-day expiry). Expired tokens trigger an automatic logout.
- Admin-only API routes are protected by `verifyToken` and `verifyAdmin` middleware. Admin-only frontend pages are protected by a `ProtectedRoute` component.
- Secrets live in `.env`, which is excluded from Git.
- **Server-side validation:** required fields (Mongoose schemas), duplicate email and room number checks, date order, occupancy limits, rating range, ownership checks, and meaningful HTTP status codes (400, 401, 403, 404, 500).
- **Client-side validation:** payment form (card number digits only and 13–19 long, expiry in MM/YY and not in the past, CVV exactly 3 digits), required inputs, and inline error messages.

---


## Troubleshooting

**`querySrv ECONNREFUSED` / `ETIMEOUT` / `ENOTFOUND` when starting the backend**
Your network is blocking MongoDB DNS lookups, which is common on university or proxy networks. Switch to a different network such as a phone hotspot, or use the standard (non-SRV) connection string from Atlas.

**`Could not connect to any servers... IP that isn't whitelisted`**
Add your current IP under **Atlas → Security → Network Access**. It changes whenever you switch networks.

**`Invalid or expired token`**
Your login has expired. Log out and log in again.

**`pnpm install` fails with network errors (`EAI_AGAIN`)**
Same cause as the DNS errors above. Change networks and retry.

**`OverwriteModelError: Cannot overwrite 'Room' model`**
Two model files with the same name, or the same file imported with different letter casing (for example `models` and `Models`). Keep one folder, and use the exact same casing in every `require`.

**Frontend shows no rooms or data**
Check that the backend terminal says `MongoDB connection success!` and that the frontend `baseURL` matches the backend port.

---

## Known Limitations and Future Work

- The payment gateway is simulated. A real integration (for example Stripe or PayHere) would replace it.
- Room photos are added as image URLs. File upload (for example Multer with cloud storage) would be a natural improvement.
- Admin accounts are created through the API. A protected "create admin" screen would be safer for production.
- Bookings are confirmed automatically. The model already supports `pending` and `rejected` states for an admin-approval workflow.
- The chatbot is rule-based keyword matching, not an AI model.
- Possible additions: email notifications, refunds and cancellation policies, a revenue dashboard, and automated tests.

---


