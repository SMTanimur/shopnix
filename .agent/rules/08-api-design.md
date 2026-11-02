# Rule 08: API Design & Communication Standards

1. **RESTful Resource URIs:**
   - Use plural nouns for resource endpoints:
     - `GET /api/v1/products`
     - `POST /api/v1/products`
     - `GET /api/v1/products/:id`
     - `PATCH /api/v1/products/:id`
     - `DELETE /api/v1/products/:id`
   - Sub-resources follow hierarchy:
     - `POST /api/v1/orders/:id/timeline`
     - `POST /api/v1/couriers/dispatch`

2. **Standard HTTP Status Codes:**
   - `200 OK`: Successful read or update.
   - `201 Created`: Resource successfully created.
   - `204 No Content`: Successful deletion without response body.
   - `400 Bad Request`: Validation failure or business rule violation.
   - `401 Unauthorized`: Missing or invalid authentication token.
   - `403 Forbidden`: Authenticated user lacks required role permissions.
   - `404 Not Found`: Resource does not exist or belongs to another tenant.
   - `409 Conflict`: Unique constraint violation (e.g., duplicate SKU or email).
   - `500 Internal Server Error`: Unhandled server exception.

3. **Universal API Envelope:**
   - Successful responses:
     ```json
     {
       "success": true,
       "data": { ... },
       "meta": {
         "page": 1,
         "limit": 20,
         "total": 150,
         "total_pages": 8
       }
     }
     ```
   - Error responses:
     ```json
     {
       "success": false,
       "status_code": 400,
       "error": "Bad Request",
       "message": "Validation failed",
       "errors": [
         {
           "field": "phone_number",
           "message": "Invalid Bangladesh phone number"
         }
       ]
     }
     ```
