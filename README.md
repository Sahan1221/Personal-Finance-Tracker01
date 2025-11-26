# Personal-Finance-Tracker
MERN Folder Structure
```bash
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
```


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



# Finance Tracker Backend API Documentation

**Base URL:**  
`http://localhost:5000`

---

## Authentication API
All authentication is session-based using `express-session`.  
Frontend must send requests with:

```javascript
credentials: "include"
```


## 1. Register User

Endpoint: POST `/api/auth/register`

Description: Creates a new user and starts a session.

Request Headers: Content-Type: application/json

Body Example:
```json
{
  "name": "test",
  "email": "test@example.com",
  "password": "12345678"
}
```
Success Response (200):
```json
{
  "message": "Registered",
  "user": {
    "id": "678abffc89b8baf4fd112233",
    "name": "test",
    "email": "test@example.com"
  }
}
```
Error Response (409):
```json
{
  "error": "Email already in use"
}

```
Error Response (400):
```json
{
  "error": "All fields required"
}

```


## 2. Login User

Endpoint: POST `/api/auth/login`

Request Headers: Content-Type: application/json

Body Example:
```json
{
  "email": "test@example.com",
  "password": "12345678"
}


```

Success Response (200):
```json
{
  "message": "Logged in",
  "user": {
    "id": "678abffc89b8baf4fd112233",
    "name": "Test",
    "email": "test@example.com"
  }
}

```

A session cookie will be automatically set:

```javascript
Set-Cookie: ft.sid=xxxx; HttpOnly; SameSite=Lax;

```

Error Response (401):
```json
{
  "error": "Invalid credentials"
}

```

## 3. Logout User

Endpoint: POST `/api/auth/logout`

Success Response (200):
```json
{
  "message": "Logged out"
}
```
## 4. Get Current Logged-In User

Endpoint: GET `/api/auth/me`

If User Logged In:
```json
{
  "user": {
    "id": "678abffc89b8baf4fd112233",
    "name": "Test"
  }
}
```

If Not Logged In:
```json
{
  "user": null
}
```

Protected Routes

All /api/transactions/* routes require session login.
If user is not logged in, you get Unauthorized (401):
```json
{
  "error": "Unauthorized"
}
```

## Transaction API
## 5. Add Transaction

Endpoint: POST `/api/transactions/add`

Request Example:
```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2025-02-01"
}
```

Success Response (200):
```json
{
  "message": "Transaction added",
  "transaction": {
    "_id": "679aa11c9dc40c111233aabb",
    "userId": "678abffc89b8baf4fd112233",
    "amount": 1500,
    "type": "income",
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2025-02-01T00:00:00.000Z",
    "createdAt": "2025-02-05T18:35:22.123Z"
  }
}
```

Error (400):
```json
{
  "error": "Missing fields"
}
```


## 6. Get Transactions

Endpoint: GET `/api/transactions/get`

Optional Query Filters:

|Query	    |Example	  |Meaning
|-----------|-----------|---------------------
|startDate	|2025-01-01	|filter by start date
|endDate	  |2025-01-31	|filter by end date
|category	  |Food	      |filter category
|type	      |expense	  |income/expense

Example Request:
GET /api/transactions/get?type=expense&category=Food

Success Response:
```json
{
  "transactions": [
    {
      "_id": "679aa11c9dc40c111233aabc",
      "userId": "678abffc89b8baf4fd112233",
      "amount": 500,
      "type": "expense",
      "category": "Food",
      "description": "KFC",
      "date": "2025-02-03T00:00:00.000Z",
      "createdAt": "2025-02-05T18:40:22.123Z"
    }
  ]
}
```

## 7. Edit Transaction

Endpoint: PUT `/api/transactions/edit/:id`

Example URL: `/api/transactions/edit/679aa11c9dc40c111233aabc`

Body Example:
```json
{
  "amount": 600,
  "description": "KFC updated"
}
```

Success Response:
```json
{
  "message": "Updated",
  "transaction": {
    "_id": "679aa11c9dc40c111233aabc",
    "amount": 600,
    "type": "expense",
    "category": "Food",
    "description": "KFC updated",
    "date": "2025-02-03T00:00:00.000Z"
  }
}
```

Error (404):
```json
{
  "error": "Not found"
}
```

## 8. Delete Transaction

Endpoint: DELETE `/api/transactions/delete/:id`

Example URL: `/api/transactions/delete/679aa11c9dc40c111233aabc`

Success Response:
```json
{
  "message": "Deleted"
}
```

Error (404):
```json
{
  "error": "Not found"
}
```

## Session Behavior Example

After login, backend sets a cookie:
```ini
ft.sid = s%3AKiummfj933ff...
```

In React:
```javascript
fetch("http://localhost:5000/api/transactions/get", {
  method: "GET",
  credentials: "include"
});
```

If cookie missing → backend returns:
```json
{
  "error": "Unauthorized"
}
```

## Summary Table

| Feature            | Method | URL                          | Auth     |
| ------------------ | ------ | ---------------------------- | -------- |
| Register           | POST   | /api/auth/register           | No       |
| Login              | POST   | /api/auth/login              | No       |
| Logout             | POST   | /api/auth/logout             | Yes      |
| Current User       | GET    | /api/auth/me                 | Optional |
| Add Transaction    | POST   | /api/transactions/add        | Yes      |
| Get Transactions   | GET    | /api/transactions/get        | Yes      |
| Edit Transaction   | PUT    | /api/transactions/edit/:id   | Yes      |
| Delete Transaction | DELETE | /api/transactions/delete/:id | Yes      |















