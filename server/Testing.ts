import * as UserService from "./services/user.service";
import supertest from "supertest";
import {app} from "./index";

describe('User', () => {
    describe('User Registration', () => {
        const userInput = {
            email: "test@example.com",
            password: "Password123!",
            passwordConfirmation: "Password123!",
            // other fields as per RegisterFormSchema
        };

        const userPayload = {
            id: "123",
            email: "test@example.com",
            // other user data
        };

        it('should return 200 and the user payload when input is valid', async () => {
            jest.spyOn(UserService, 'getUserByEmail').mockReturnValueOnce(null);
            jest.spyOn(UserService, 'createNewUser').mockReturnValueOnce();

            const { statusCode, body } = await supertest(app)
                .post('/register')
                .send(userInput);

            expect(statusCode).toBe(200);
            expect(body.user.email).toBe(userPayload.email);
            // Add more assertions as needed
        });

        it('should return 422 when input is invalid', async () => {
            const invalidInput = { ...userInput, email: 'invalid-email'};

            const { statusCode, body } = await supertest(app)
                .post('/register')
                .send(invalidInput);

            expect(statusCode).toBe(422);
            expect(body.message).toContain('validation error'); // Adjust this according to your returnMsg function
        });

        it('should return 409 when the user already exists', async () => {
            jest.spyOn(UserService, 'getUserByEmail').mockReturnValueOnce(userPayload);

            const { statusCode, body } = await supertest(app)
                .post('/register')
                .send(userInput);

            expect(statusCode).toBe(409);
            expect(body.message).toBe('User already exists');
        });

        it('should return 500 when there is an internal server error', async () => {
            jest.spyOn(UserService, 'getUserByEmail').mockReturnValueOnce(null);
            jest.spyOn(UserService, 'createNewUser').mockImplementationOnce(() => {
                throw new Error('Internal Server Error');
            });

            const { statusCode, body } = await supertest(app)
                .post('/register')
                .send(userInput);

            expect(statusCode).toBe(500);
            expect(body.message).toBe('Internal Server Error');
        });
    });
});