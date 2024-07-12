**Signup Screen:**
- Include fields for username/email, password (with confirmation), and optional fields like name and profile picture.
- Implement validation for the required fields and email format using React state management and validation libraries.
- Include terms and conditions checkbox.
- Add password visibility toggle.
- Display clear error messages and success messages.
- Redirect to the post list screen after successful signup using React Router.

**Post List Screen:**
- There should be a screen where user can scroll infinitely and posts will be rendered using GET api of posts.
- Implement responsive design using Tailwind.

### API Endpoints:

#### POST /signup:
- Registers a new user with provided username, email, and password.
- Validates input, ensures unique usernames and emails, hashes passwords securely. Stores user data in the database.
- Returns a success message and JWT token upon successful registration.

#### GET /posts:
- Paginated implementation of fetching posts data from database.
- Secure and non authenticated apis will be rejected.

**JWT Implementation:**
- Generate JWT tokens with appropriate payload and expiration time upon successful login.
- Validate JWT tokens in protected routes to ensure user authentication.
- Implement robust token refresh mechanisms.

**Key Points:**
- ***Write unit tests for API endpoints using jest and superTest.***
- ***Implement password reset functionality.***
- ***Add rate limiting to protect against brute force attacks.***
- ***Handle sessions and token expiration effectively.***
- ***Securely store passwords using strong hashing algorithms (bcrypt).***
- ***Implement proper error handling and provide informative error messages.***
- Use middleware for authentication and authorization.
- Protect against common attacks like SQL injection and XSS.
- using environment variables for sensitive information.

**Future Upgrade**
- [ ] Add image upload option in Register form.
- [ ] Fix|Add mock checking for nodemailer <sendOTP>