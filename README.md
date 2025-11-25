# Personal-Finance-Tracker
MERN Folder Structure

finance-tracker/
│
├── backend/        # Node + Express + MongoDB API
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
│
├── frontend/       # React app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── package.json



Database (MongoDB) Design

| Field    | Type            |
| -------- | --------------- |
| _id      | ObjectId        |
| name     | String          |
| email    | String          |
| password | String (hashed) |


Transactions Collection

| Field       | Type                    |
| ----------- | ----------------------- |
| _id         | ObjectId                |
| userId      | ObjectId (ref User)     |
| amount      | Number                  |
| type        | String (income/expense) |
| category    | String                  |
| description | String                  |
| date        | Date                    |


Backend APIs (Express + MongoDB)

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| POST   | `/api/auth/register` | Create user |
| POST   | `/api/auth/login`    | Login user  |


Transaction APIs

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/transactions/add`        | Add new transaction       |
| GET    | `/api/transactions/get`        | Get all user transactions |
| PUT    | `/api/transactions/edit/:id`   | Edit                      |
| DELETE | `/api/transactions/delete/:id` | Delete                    |
