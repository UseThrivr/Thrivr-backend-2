# API Documentation

## Base URL

```
## https://thrivr.onrender.com
```

## Authentication

### JWT Authentication

All endpoints that require authentication should include a Bearer token in the header:

```
Authorization: Bearer <token>
```

### Middleware

- **`authenticateToken`**: Middleware that validates the JWT token for a user from the `Authorization` header. Returns `401 Unauthorized` if the token is missing or invalid.
- **`verifyBusiness`**: Middleware that checks if the authenticated user is associated with a valid business. Returns `401 Unauthorized` or `404 Not Found` if validation fails.

## Endpoints

### **Authentication**

#### **1. User Registration**

**URL:** `/api/v1/auth/signup`  
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

- **Code:** 200
- **Content:**

```json
{
  "success": true,
  "message": "Proceed to enter otp."
}
```

**Error Responses:**

- **Code:** 400 BAD REQUEST  
  **Content:** `{ "error": "Bad request." }`
  Ensure to include all parameters in the request.

#### **2. Business Registration**

**URL:** `/api/v1/auth/signup/business`  
**Method:** `POST`  
**Description:** Register a new business with the provided credentials.

**Request Body:**

```json
{
  "full_name": "string",
  "business_name": "string",
  "location": "string",
  "email": "string",
  "phone_number": "string", //format: +234XXX-XXXX-XXX
  "description": "string",
  "password": "string",
  "logo": "image file" // single file
}
```

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
  "success": true,
  "message": "Proceed to enter otp."
}
```

**Error Responses:**

- **Code:** 400 BAD REQUEST  
  **Content:** `{ "error": "Invalid registration details." }`

#### **3. User Login**

**URL:** `/auth/login`  
**Method:** `POST`  
**Description:** User verification before proceeding to next stage(OTP Verifcation).

**Request Body:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbF9uYW1lIjoiQXNoaXJ1IHNoZXJpZmYiLCJidXNpbmVzc19uYW1lIjoiU2hlcmlmZidzIFNob2VzIiwibG9jYXRpb24iOiJPam8sIExhZ29zIE5pZ2VyaWEuIiwiZW1haWwiOiJsYW5yZTI5NjdAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiKzIzNDkxNjQxODc0OTUiLCJkZXNjcmlwdGlvbiI6IldlIHNlbGwgc2hvZXMiLCJpbWFnZV9wYXRoIjoiIiwicm9sZSI6ImJ1c2luZXNzIiwiaWF0IjoxNzMzMDUzNDkxLCJleHAiOjE3MzMxMzk4OTF9.f76c4IpLuR6Nza86eP9i4mV5NpJaEAXul3MtUAh2iZk",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "business_name": "John's Shoes",
    "location": "Ojo, Lagos Nigeria.",
    "email": "abc123@gmail.com",
    "phone_number": "+23498765983",
    "description": "We sell shoes",
    "image_path": "",
    "role": "business"
  }
}
```

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
  "success": true,
  "message": "Proceed to enter otp."
}
```

#### **4. OTP Verification**

**URL:** `/api/v1/auth/verify-otp`  
**Method:** `POST`  
**Description:** Verify the user creation process and provide a token afterwards.

**Request Body:**

```json
{
  "otp": "number",
  "email": "string"
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
  "message": "Success",
  "code": "SIGNUP_COMPLETE",
  "details": "Signup completed.",
  "user": {
    "role": "business",
    "id": 1,
    "full_name": "John Doe",
    "business_name": "John shoes",
    "location": "Lagos nigeria",
    "email": "abc828@gmail.com",
    "phone_number": "+2349109873945",
    "description": "we sell shoes",
    "image_path": "https://thrivr-business-logos.s3.eu-north-1.amazonaws.com/business_logos/1732195450785-79912014017038707_1666746423619719_8198474063251261060_o.jpg",
    "updatedAt": "2024-11-21T13:24:48.124Z",
    "createdAt": "2024-11-21T13:24:48.124Z"
  },
  "settings": {
    "banner_image": "",
    "theme": "",
    "working_days": "",
    "opening_hours": "",
    "currency": "",
    "id": 1,
    "store_id": 1,
    "updatedAt": "2024-11-21T13:24:48.161Z",
    "createdAt": "2024-11-21T13:24:48.161Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYnVzaW5lc3MiLCJpZCI6MSwiZnVsbF9uYW1lIjoiQXNoaXJ1IFNoZXJpZmYiLCJidXNpbmVzc19uYW1lIjoiU2hlcmlmZiBzaG9lcyIsImxvY2F0aW9uIjoiTHVzYWRhIG5pZ2VyaWEiLCJlbWFpbCI6ImxhbnJlMjk2N0BnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIrMjM0OTE2NDE4NzQ5NSIsImRlc2NyaXB0aW9uIjoid2Ugc2VsbCBzaG9lcyIsImltYWdlX3BhdGgiOiJodHRwczovL3Rocml2ci1idXNpbmVzcy1sb2dvcy5zMy5ldS1ub3J0aC0xLmFtYXpvbmF3cy5jb20vYnVzaW5lc3NfbG9nb3MvMTczMjE5NTQ1MDc4NS03OTkxMjAxNDAxNzAzODcwN18xNjY2NzQ2NDIzNjE5NzE5XzgxOTg0NzQwNjMyNTEyNjEwNjBfby5qcGciLCJ1cGRhdGVkQXQiOiIyMDI0LTExLTIxVDEzOjI0OjQ4LjEyNFoiLCJjcmVhdGVkQXQiOiIyMDI0LTExLTIxVDEzOjI0OjQ4LjEyNFoiLCJpYXQiOjE3MzIxOTU0ODgsImV4cCI6MTczMjI4MTg4OH0.wOUVQu9h-roJVaIa1fkJzdmWmvxE2aVXkNJvHRXAyio"
}
```

#### **5. Resend otp**

**URL:** `/api/v1/resend-otp`  
**Method:** `GET`  
**Description:** Resends the otp.


**Request Body:**

```json
{
  "email": "string"
}
```


**Success Response:**

- **Code:** 200
- **Content:**

```json
{
  "success": true,
  "message": "OTP sent sucessfully."
}
```

**Error Responses:**

- **Code:** 404 NOT_FOUND  
  **Content:** `{ "error": "No login proces found." }`

#### **6. Get business details**

**URL:** `/api/v1/business/:id?`
**Method:** `GET`  
**Description:** Gets all the details of a particular business.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**parameters:** -`id: Business id`

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John doe",
    "business_name": "John's Shoes",
    "location": "Ojo, Lagos Nigeria.",
    "email": "abc123@gmail.com",
    "phone_number": "+234918740978",
    "description": "We sell shoes",
    "image_path": "",
    "role": "business",
    "Settings": [
      {
        "id": 1,
        "banner_image": "",
        "theme": "",
        "working_days": "",
        "opening_hours": "",
        "currency": "",
        "store_id": 1,
        "createdAt": "2024-12-01T11:43:59.000Z",
        "updatedAt": "2024-12-01T11:43:59.000Z"
      }
    ],
    "Groups": [
      //customer groups
      {
        "id": 1,
        "name": "My special customers",
        "store_id": 1,
        "createdAt": "2024-12-01T11:51:48.000Z",
        "updatedAt": "2024-12-01T11:51:48.000Z"
      }
    ],
    "products": [
      {
        "id": 1,
        "name": "Nike wig",
        "price": 200000,
        "category": "wig",
        "description": "The nike airforce wig",
        "purchaseDate": "29-10-2024",
        "supplier": "Sheriff closet",
        "business_id": 1,
        "amount_left": 0,
        "createdAt": "2024-12-01T11:50:55.000Z",
        "updatedAt": "2024-12-01T11:50:55.000Z"
      }
    ]
  }
}
```

**Error Responses:**

- **Code:** 404 NOT_FOUND  
  **Content:** `{error: 'Server error.', message: 'Error fetching details.'}`

## Business Endpoints

### **7. Add Product**

**URL:** `/api/v1/products`  
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
  "logos": "array (optional)"  //max number of images: 10
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "amount_left": 0,
        "id": 1,
        "name": "Nike wig",
        "price": "200000",
        "category": "wig",
        "description": "The nike airforce wig",
        "purchaseDate": "29-10-2024",
        "supplier": "Sheriff closet",
        "business_id": 1,
        "updatedAt": "2024-12-01T14:26:19.242Z",
        "createdAt": "2024-12-01T14:26:19.242Z"
    }
}
```

**Error Responses:**

- **Code:** 400 BAD REQUEST  
  **Content:** `{ "error": "Bad request." }`
- **Code:** 401 UNAUTHORIZED  
  **Content:** `{ "error": "Unauthorized access." }`

### **8. Get Product**

**URL:** `/products/:id?`  
**Method:** `GET`  
**Description:** Retrieve details of a product by its ID.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Path Parameters:**

- `id`: Product ID
If id is provided, it returns the product with the particular id and if not it returns all the product under the business gotten from token provided.

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "success": true,
    "data": {
        "id": 7,
        "name": "Nike shoes",
        "price": 200000,
        "category": "shoes",
        "description": "cool shoes",
        "purchaseDate": "29-10-2024",
        "supplier": "ode",
        "business_id": 1,
        "amount_left": 0,
        "createdAt": "2024-12-01T14:56:18.000Z",
        "updatedAt": "2024-12-01T14:56:18.000Z",
        "ProductImages": [
            {
                "id": 2,
                "product_id": 7,
                "image_path": "https://thrivr-business-logos.s3.eu-north-1.amazonaws.com/Product_images/1733064955089-8860237221e03cbafa788063f15678d5b3a93a2e1c47941124fd46cbce4bcd0f327b10efc.png",
                "createdAt": "2024-12-01T14:56:18.000Z",
                "updatedAt": "2024-12-01T14:56:18.000Z"
            },
            {
                "id": 3,
                "product_id": 7,
                "image_path": "https://thrivr-business-logos.s3.eu-north-1.amazonaws.com/Product_images/1733064955100-64458204817038707_1666746423619719_8198474063251261060_o.jpg",
                "createdAt": "2024-12-01T14:56:18.000Z",
                "updatedAt": "2024-12-01T14:56:18.000Z"
            },
            {
                "id": 4,
                "product_id": 7,
                "image_path": "https://thrivr-business-logos.s3.eu-north-1.amazonaws.com/Product_images/1733064955091-34764327813671aef3b4fb5b0f2e62c575d2ad165239c091dcfe402b4c644e0e4406c5820.png",
                "createdAt": "2024-12-01T14:56:18.000Z",
                "updatedAt": "2024-12-01T14:56:18.000Z"
            }
        ]
    }
}
```

**Error Responses:**

- **Code:** 404 NOT FOUND  
  **Content:** `{ "error": "Product not found." }`



### **9. Create task**

**URL:** `/api/v1/tasks`  
**Method:** `POST`  
**Description:** Create a new task.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "sucess": true,
    "data": {
        "status": "pending",
        "id": 1,
        "title": "do the dishes",
        "details": "just do the fucking dishes",
        "due_date": "23/10/2024",
        "time": "22:10",
        "reminder": "an hour before",
        "user_id": 1,
        "updatedAt": "2024-12-01T15:01:35.050Z",
        "createdAt": "2024-12-01T15:01:35.050Z"
    }
}
```


### **10. Get task**

**URL:** `/tasks/:id?`  
**Method:** `GET`  
**Description:** Retrieve details of a task by its ID.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Path Parameters:**

- `id`: Task ID
If id is provided, it returns the task with the particular id and if not it returns all the task under the business gotten from token provided.

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "do the dishes",
        "details": "just do the fucking dishes",
        "due_date": "23/10/2024",
        "time": "22:10",
        "status": "pending",
        "reminder": "an hour before",
        "user_id": 1,
        "createdAt": "2024-12-01T15:01:35.000Z",
        "updatedAt": "2024-12-01T15:01:35.000Z"
    }
}
```

**Error Responses:**

- **Code:** 404 NOT FOUND  
  **Content:** `{ "error": "Task not found." }`





### **11. Mark task as done**

**URL:** `/tasks/:id/done`  
**Method:** `PATCH`  
**Description:** Marks task as done.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Path Parameters:**

- `id`: Compulsory


**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "do the dishes",
        "details": "just do the fucking dishes",
        "due_date": "23/10/2024",
        "time": "22:10",
        "status": "completed",  //completed status for a completed task
        "reminder": "an hour before",
        "user_id": 1,
        "createdAt": "2024-12-01T15:01:35.000Z",
        "updatedAt": "2024-12-01T15:05:48.000Z"
    }
}
```

**Error Responses:**

- **Code:** 404 NOT FOUND  
```json
  {
    "error": "Task not found.",
    "message": "Task does not exist."
}
```



#### **2. Business Updating**

**URL:** `/api/v1/business`  
**Method:** `PATCH`  
**Description:** Update a business's details by providing the new details you want to input.

**Request Body:**

```json
{
  "fullname": "string",
  "business_name": "string",
  "location": "string",
  "email": "string",
  "phone_number": "string", //format: +234XXX-XXXX-XXX
  "description": "string",
  "password": "string",
  "logo": "image file" // single file
}
```

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "message": "Update successful.",
    "user": {
        "full_name": "John doe",
        "business_name": "John's Shoes",
        "location": "Ojo, Lagos Nigeria.",
        "email": "abc123@gmail.com",
        "phone_number": "+234098467987",
        "description": "We sell shoes",
        "role": "business",
        "image_path": ""
    }
}
```

**Error Responses:**

- **Code:** 500 SERVER ERROR  
  **Content:** `{ error: "Update failed." }`




#### **2. Business settings updating**

**URL:** `/api/v1/business`  
**Method:** `PATCH`  
**Description:** Update a business's details by providing the new details you want to input.

**Request Body:**

```json
{
  "theme": "string",
  "banner_image": "string",
  "working_days": "string",
  "opening_hours": "string",
  "currency": "string", //format: +234XXX-XXXX-XXX
  "logo": "image file" // single file
}
```

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "message": "Update successful.",
    "user": {
        "full_name": "John Doe",
        "business_name": "John's Shoes",
        "location": "Ojo, Lagos Nigeria.",
        "email": "abc123@gmail.com",
        "phone_number": "+23490876987",
        "description": "We sell shoes",
        "role": "business",
        "image_path": "",
        "Settings": [
            {
                "id": 1,
                "banner_image": "",
                "theme": "dark",
                "working_days": "",
                "opening_hours": "",
                "currency": "",
                "store_id": 1,
                "createdAt": "2024-12-01T14:45:04.000Z",
                "updatedAt": "2024-12-01T15:22:26.000Z"
            }
        ]
    }
}
```

**Error Responses:**

- **Code:** 400 BAD REQUEST  
  **Content:** `{ error: "No fields provided for update." }`









### **12. Fetch Business**

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
        "id": 1,
        "full_name": "John doe",
        "business_name": "John's Shoes",
        "location": "Ojo, Lagos Nigeria.",
        "email": "abc123@gmail.com",
        "phone_number": "+2349087987468",
        "description": "We sell shoes",
        "image_path": "",
        "wallet_balance": "400000.00",
        "role": "business",
        "Settings": [
            {
                "id": 1,
                "banner_image": "banner",
                "theme": "dark",
                "working_days": "mon-friday",
                "opening_hours": "10-12",
                "currency": "NGN",
                "store_id": 1,
                "createdAt": "2024-12-01T14:45:04.000Z",
                "updatedAt": "2024-12-01T16:14:30.000Z"
            }
        ],
        "Groups": [
            {
                "id": 1,
                "name": "ashiru sheriff",
                "store_id": 1,
                "createdAt": "2024-12-01T15:31:35.000Z",
                "updatedAt": "2024-12-01T15:31:35.000Z"
            }
        ],
        "products": [
            {
                "id": 1,
                "name": "Nike wig",
                "price": "200000.00",
                "category": "wig",
                "description": "The nike airforce wig",
                "purchaseDate": "29-10-2024",
                "supplier": "Sheriff closet",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:45:46.000Z",
                "updatedAt": "2024-12-01T14:45:46.000Z"
            },
            {
                "id": 2,
                "name": "Nike wig",
                "price": "200000.00",
                "category": "wig",
                "description": "The nike airforce wig",
                "purchaseDate": "29-10-2024",
                "supplier": "Sheriff closet",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:47:36.000Z",
                "updatedAt": "2024-12-01T14:47:36.000Z"
            },
            {
                "id": 3,
                "name": "Nike wig",
                "price": "200000.00",
                "category": "wig",
                "description": "The nike airforce wig",
                "purchaseDate": "29-10-2024",
                "supplier": "Sheriff closet",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:47:38.000Z",
                "updatedAt": "2024-12-01T14:47:38.000Z"
            },
            {
                "id": 4,
                "name": "Nike wig",
                "price": "200000.00",
                "category": "wig",
                "description": "The nike airforce wig",
                "purchaseDate": "29-10-2024",
                "supplier": "Sheriff closet",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:47:38.000Z",
                "updatedAt": "2024-12-01T14:47:38.000Z"
            },
            {
                "id": 5,
                "name": "Nike wig",
                "price": "200000.00",
                "category": "wig",
                "description": "The nike airforce wig",
                "purchaseDate": "29-10-2024",
                "supplier": "Sheriff closet",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:47:39.000Z",
                "updatedAt": "2024-12-01T14:47:39.000Z"
            },
            {
                "id": 6,
                "name": "Nike shoes",
                "price": "200000.00",
                "category": "shoes",
                "description": "cool shoes",
                "purchaseDate": "29-10-2024",
                "supplier": "ode",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:55:20.000Z",
                "updatedAt": "2024-12-01T14:55:20.000Z"
            },
            {
                "id": 7,
                "name": "Nike shoes",
                "price": "200000.00",
                "category": "shoes",
                "description": "cool shoes",
                "purchaseDate": "29-10-2024",
                "supplier": "ode",
                "business_id": 1,
                "amount_left": 0,
                "createdAt": "2024-12-01T14:56:18.000Z",
                "updatedAt": "2024-12-01T14:56:18.000Z"
            }
        ],
        "isStaff": true,
        "permissions": {
            "edit_products": true,
            "can_manage_payments": true,
            "can_edit_store_settings": true,
            "can_view_and_edit_orders": true,
            "can_view_and_Edit_customers": true,
            "can_view_business_reports": true
        }
    }
}
```

### **13. Add Task**

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

### **14. Get Tasks**

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

### **15. Update Business Settings**

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
  "theme": "string",
  "banner_image": "string",
  "working_days": "string",
  "opening_hours": "string",
  "currency": "string"
}
```

**Success Response:**

- **Code:** 200
- **Content:**

```json
{
    "message": "Update successful.",
    "user": {
        "full_name": "john Doe",
        "business_name": "john's Shoes",
        "location": "Ojo, Lagos Nigeria.",
        "email": "abc123@gmail.com",
        "phone_number": "+234908763985",
        "description": "We sell shoes",
        "role": "business",
        "image_path": "",
        "Settings": [
            {
                "id": 1,
                "banner_image": "banner",
                "theme": "dark",
                "working_days": "monday-friday",
                "opening_hours": "10-12",
                "currency": "NGN",
                "store_id": 1,
                "createdAt": "2024-12-01T14:45:04.000Z",
                "updatedAt": "2024-12-01T16:14:30.000Z"
            }
        ]
    }
}
```

### **16. Add Customer**

**URL:** `/api/v1/customer`  
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
  "group": "string (optional)",
  "instagram": "string(optional)"
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "sucess": true,
    "data": {
        "group": "none",
        "id": 1,
        "name": "John doe",
        "email": "abc123@gmail.com",
        "phone_number": "+234908765908",
        "instagram": "instagram.com/john_doe",  
        "business_id": 1,
        "updatedAt": "2024-12-01T15:26:47.041Z",
        "createdAt": "2024-12-01T15:26:47.041Z"
    }
}
```

### **17. Add Customer group**

**URL:** `/api/v1/group`  
**Method:** `POST`  
**Description:** Add a new customer to the business.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Request Body:**

```json
{
  "name": "string", //name of group
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "sucess": true,
    "data": {
        "id": 1,
        "name": "Good customers",
        "store_id": 1,
        "updatedAt": "2024-12-01T15:31:35.636Z",
        "createdAt": "2024-12-01T15:31:35.636Z"
    }
}
```



### **18. Add staff to your business**


### **19. Make an order**

**URL:** `/api/v1/order`  
**Method:** `POST`  
**Description:** Make a new order.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Request Body:**

```json
{
  "product_id": "array of product id's", // [12, 10, 9]
  "business_id": "string",
  "role": "string",
  "customer_name": "string",
  "customers_contact": "string",
  "sales_channel": "string",
  "payment_channel": "string",
  "order_date": "string",
  "payment_status": "string",
  "note": "string",
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "product_id": "1",
        "business_id": 1,
        "customer_name": "john doe",
        "customers_contact": "+2349087675467",
        "sales_channel": "facebook",
        "payment_channel": "paypal",
        "order_date": "29-10-2024",
        "payment_status": "paid",
        "note": "ii have no notes here",
        "updatedAt": "2024-12-07T09:17:26.322Z",
        "createdAt": "2024-12-07T09:17:26.322Z"
    }
}
```


### **20. update an order**

**URL:** `/api/v1/order/:id`  
**Method:** `PATCH`  
**Description:** Update payment status for an order.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Path parameters:**

- `id(Compulsory)`


**Request Body:**

```json
{
  "payment_status": "string",
}
```

**Success Response:**

- **Code:** 201
- **Content:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "product_id": "1",
        "business_id": 1,
        "customer_name": "john doe",
        "customers_contact": "+2349087675467",
        "sales_channel": "facebook",
        "payment_channel": "paypal",
        "order_date": "29-10-2024",
        "payment_status": "not paid",
        "note": "ii have no notes here",
        "updatedAt": "2024-12-07T09:17:26.322Z",
        "createdAt": "2024-12-07T09:17:26.322Z"
    }
}
```

**Error message**
- **Code** 409
- **ccontent:**
```json
{
  "error": "conflict", 
  "message": "Order already paid for."
}
```



### **21. Get dashboard**
**URL:** `/api/v1/dashboard`  
**Method:** `GET`  
**Description:** Get dashboard details for he logged in user.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Success Response:**

- **Code:** 201
- **Content:**

**Pending**



### **21. Delete account**
**URL:** `/api/v1/user`  
**Method:** `DELETE`  
**Description:** Delete current user account.  
**Headers:**

- `Authorization: Bearer <token>`

**Middleware:**

- `verifyBusiness`

**Success Response:**

- **Code:** 204
- **Content:**

```json
{"success": true, "message": "Account deleted successfully"}
```
 
