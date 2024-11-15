Let me rewrite the updated markdown directly here for you, including the authentication routes.

---

# API Documentation

## Base URL
```
https://yourapi.com/api
```

## Authentication

### JWT Authentication
All endpoints that require authentication should include a Bearer token in the header:
```
Authorization: Bearer <token>
```

### Middleware
- **`authenticateToken`**: Middleware that validates the JWT token from the `Authorization` header. Returns `401 Unauthorized` if the token is missing or invalid.
- **`verifyBusiness`**: Middleware that checks if the authenticated user is associated with a valid business. Returns `401 Unauthorized` or `404 Not Found` if validation fails.

## Endpoints

### **Authentication**

#### **1. User Registration**
**URL:** `/auth/register`  
**Method:** `POST`  
**Description:** Register a new user with the provided credentials.  

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response:**
- **Code:** 201  
- **Content:** 
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "userId": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- **Code:** 400 BAD REQUEST  
  **Content:** `{ "error": "Invalid registration details." }`

#### **2. User Login**
**URL:** `/auth/login`  
**Method:** `POST`  
**Description:** Authenticate a user and provide a JWT token.  

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "token": "string"
}
```

**Error Responses:**
- **Code:** 401 UNAUTHORIZED  
  **Content:** `{ "error": "Invalid credentials." }`

#### **3. Token Validation**
**URL:** `/auth/validate-token`  
**Method:** `GET`  
**Description:** Validate the current JWT token to ensure it is still active.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `authenticateToken`  

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "message": "Token is valid."
}
```

**Error Responses:**
- **Code:** 401 UNAUTHORIZED  
  **Content:** `{ "error": "Token is invalid or expired." }`

## Business Endpoints

### **4. Add Product**
**URL:** `/product`  
**Method:** `POST`  
**Description:** Add a new product to the business.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `authenticateToken`  
- `verifyBusiness`  

**Request Body:**
```json
{
  "name": "string",
  "price": "string",
  "category": "string",
  "description": "string",
  "purchase_date": "string",
  "supplier": "string",
  "logos": "array (optional)"
}
```

**Success Response:**
- **Code:** 201  
- **Content:** 
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "price": "string",
    "category": "string",
    "description": "string",
    "purchaseDate": "string",
    "supplier": "string"
  }
}
```

**Error Responses:**
- **Code:** 400 BAD REQUEST  
  **Content:** `{ "error": "Bad request." }`
- **Code:** 401 UNAUTHORIZED  
  **Content:** `{ "error": "Unauthorized access." }`

### **5. Get Product**
**URL:** `/product/:id`  
**Method:** `GET`  
**Description:** Retrieve details of a product by its ID.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `authenticateToken`  

**Path Parameters:**
- `id`: Product ID

**Success Response:**
- **Code:** 200  
- **Content:**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "price": "string",
    "category": "string",
    "description": "string",
    "purchaseDate": "string",
    "supplier": "string"
  }
}
```

**Error Responses:**
- **Code:** 404 NOT FOUND  
  **Content:** `{ "error": "Product not found." }`

### **6. Get Order**
**URL:** `/order/:id`  
**Method:** `GET`  
**Description:** Retrieve details of an order by its ID.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `authenticateToken`  

**Path Parameters:**
- `id`: Order ID

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "data": {
    "orderId": "number",
    "product": "object",
    "quantity": "number",
    "totalPrice": "string",
    "status": "string"
  }
}
```

### **7. Fetch Business**
**URL:** `/business`  
**Method:** `GET`  
**Description:** Fetch business details for the authenticated user.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `verifyBusiness`  

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "data": {
    "businessId": "number",
    "name": "string",
    "email": "string",
    "address": "string",
    "contact": "string"
  }
}
```

### **8. Add Task**
**URL:** `/task`  
**Method:** `POST`  
**Description:** Add a new task for a business.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `verifyBusiness`  

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "due_date": "string",
  "priority": "string"
}
```

**Success Response:**
- **Code:** 201  
- **Content:** 
```json
{
  "success": true,
  "data": {
    "taskId": "number",
    "title": "string",
    "description": "string",
    "dueDate": "string",
    "priority": "string"
  }
}
```

### **9. Get Tasks**
**URL:** `/tasks`  
**Method:** `GET`  
**Description:** Retrieve all tasks for the authenticated business.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `verifyBusiness`  

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "data": [
    {
      "taskId": "number",
      "title": "string",
      "description": "string",
      "dueDate": "string",
      "priority": "string"
    }
  ]
}
```

### **10. Update Business Settings**
**URL:** `/business/settings`  
**Method:** `PATCH`  
**Description:** Update settings for the authenticated business.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `verifyBusiness`  

**Request Body:**
```json
{
  "settings": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Success Response:**
- **Code:** 200  
- **Content:** 
```json
{
  "success": true,
  "message": "Business settings updated successfully."
}
```

### **11. Add Customer**
**URL:** `/customer`  
**Method:** `POST`  
**Description:** Add a new customer to the business.  
**Headers:**  
- `Authorization: Bearer <token>`  

**Middleware:**  
- `verifyBusiness`  

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone_number": "string",
  "group": "string (optional)"
}
```

**Success Response:**
- **Code:** 201  
- **Content:** 
```json
{
  "success": true,
  "data": {
    "customerId": "number",
    "name": "string",
    "email": "string",
    "phone_number": "string",
    "group": "string"
  }
}
```

---

Let me know if you need this saved into a markdown file again!