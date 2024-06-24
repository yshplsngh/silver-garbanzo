import supertest from 'supertest';
import * as UserService from '../services/user.service';
import {app} from '../index';
import {decodedTokenType, PasswordFormType, RegisterFormType, UserCDataType} from "../types/auth";
import {signJWT} from "../utils/jwtUtils";
import {ATT} from "../utils/config";
import bcrypt from "bcrypt";

const createUserReturnData: UserCDataType = {
    id: 1,
    email: 'yashpal@gmail.com',
    name: 'yashpal',
    picture: 'picture.png',
    verified: false,
};

const accessToken = signJWT({createUserReturnData}, {expiresIn: ATT})


describe('User Mock testing', () => {
    describe('User Registration', () => {
        let userInput: RegisterFormType = {
            name: "yashpal",
            email: "yashpal@gmail.com",
            picture: "picture.png",
            password: "password",
            confirmPassword: "password",
            tac: true
        };


        const userPayload: decodedTokenType = {
            user: createUserReturnData,
            iat: expect.any(Number),
            exp: expect.any(Number)
        };

        describe('Given the input is Invalid', () => {
            it('should return 422', async () => {
                const invalidUserInput = {...userInput, email: 'wrong email format'};

                /*no data expectation, should not be called*/
                const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockRejectedValueOnce('oh! no getUserByEmail is called');

                /*no data expectation, should not be called*/
                const createNewUserMock = jest.spyOn(UserService, 'createNewUser').mockRejectedValueOnce('!oh no createNewUser is called')

                const {status, body} = await supertest(app).post('/api/user/register').send(invalidUserInput);

                expect(status).toBe(422);
                expect(body.message).toBe("Invalid email");

                expect(getUserByEmailMock).not.toHaveBeenCalled();
                expect(createNewUserMock).not.toHaveBeenCalled();
            })
        })

        describe('when user already exists', () => {
            it('should return 409', async () => {

                const existEmailUserInput = {...userInput, email: "ThisEmailAlreadyExist@gmail.com"};

                /*data expecting from getUserByEmail is an Email*/
                const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValueOnce({email: existEmailUserInput.email})

                /* no data expectation, should not be called */
                const createNewUserMock = jest.spyOn(UserService, 'createNewUser').mockRejectedValueOnce('oh no createNewUser is called')

                const {status, body} = await supertest(app).post('/api/user/register').send(existEmailUserInput);

                expect(status).toBe(409);
                expect(body.message).toBe('User already exists');

                expect(getUserByEmailMock).toHaveBeenCalledWith({userEmail: existEmailUserInput.email});
                expect(createNewUserMock).not.toHaveBeenCalled();
            })
        })

        describe('internal server error while creating user', () => {
            it('should return 500', async () => {

                /*data expecting from getUserByEmail is null*/
                const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValueOnce(null);

                /*error expecting from createNewUser is */
                const createNewUserMock = jest.spyOn(UserService, 'createNewUser').mockImplementationOnce(() => {
                    throw new Error('Internal Server Error');
                })

                const {body, status} = await supertest(app).post('/api/user/register').send(userInput);

                expect(status).toBe(500);
                expect(body.message).toBe('Internal Server Error');

                /*data sending to getUserByEmail*/
                expect(getUserByEmailMock).toHaveBeenCalledWith({userEmail: userInput.email})
                /*data sending to createNewUser*/
                expect(createNewUserMock).toHaveBeenCalledWith({userData: userInput, hashedPass: expect.any(String)});
            })
        })

        describe('Given the input is valid', () => {
            it('should return 201 with userPayload', async () => {

                /*data expecting from getUserByEmail is null*/
                const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValueOnce(null);

                /*data expecting from createNewUser is <createUserReturnData>*/
                const createNewUserMock = jest.spyOn(UserService, 'createNewUser').mockResolvedValueOnce(createUserReturnData);

                const {status, body} = await supertest(app).post('/api/user/register').send(userInput);

                expect(status).toBe(201);
                expect(body).toMatchObject(userPayload);

                /*data sending to getUserByEmail*/
                expect(getUserByEmailMock).toHaveBeenCalledWith({userEmail: userInput.email});

                /*data sending to createNewUser*/
                expect(createNewUserMock).toHaveBeenCalledWith({userData: userInput, hashedPass: expect.any(String)});
            });
        });


    });

    describe('Reset Password', () => {
        const userInput: PasswordFormType = {
            id: 1,
            oldPassword: 'old_password',
            newPassword: 'new_password',
            newConfirmPassword: 'new_password'
        }

        /*
        * Hashed oldPassword is stored in DB, so we need to create a hash of that password to mimic database result.
        * coz inside endpoint userInput old_password is compare with DB old password,
        * so we need to provide already hashed password
        */

        const getUserByIdWithPassReturn = {id: userInput.id, password:"$2b$10$YKccvcqASvBncHIdY7vneeWu7mhAoU64iBxyOvTLU22Uu0BJg/8ya"};

        describe('Given the input is Invalid', () => {
            it('should return 422', async () => {
                const invalidUserInput = {...userInput,newConfirmPassword: 'different_password'};

                const getUserByIdWithPassMock = jest.spyOn(UserService, 'getUserByIdWithPass').mockRejectedValueOnce('Oh no getUserByIdWithPass is called');
                const updateUserByIdMock = jest.spyOn(UserService, 'updateUserById').mockRejectedValueOnce('Oh no updateUserById is called');

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(invalidUserInput)

                expect(status).toBe(422);
                expect(body.message).toEqual("password don't match")

                expect(getUserByIdWithPassMock).not.toHaveBeenCalled()
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            })
        })

        describe("User of Id Not found", () => {
            it('should return 404', async () => {
                const getUserByIdWithPassMock = jest.spyOn(UserService, "getUserByIdWithPass").mockResolvedValueOnce(null);
                const updateUserByIdMock = jest.spyOn(UserService, "updateUserById").mockRejectedValueOnce('Oh no updateUserById is called')

                const {
                    body,
                    status
                } = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(userInput)

                expect(status).toBe(404);
                expect(body.message).toEqual("User not found")

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId:userInput.id});
                expect(updateUserByIdMock).not.toHaveBeenCalled();
            });
        })

        describe("Old Password does not match", () => {
            it('should return 401', async () => {
                const wrongOldPasswordInput = {
                    ...userInput,
                    oldPassword: "invalid_Old_Password",
                };

                const getUserByIdWithPassMock = jest.spyOn(UserService, "getUserByIdWithPass").mockResolvedValueOnce(getUserByIdWithPassReturn);
                const updateUserByIdMock = jest.spyOn(UserService, "updateUserById").mockRejectedValueOnce('Oh no updateUserById is called')

                const {status,body} = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(wrongOldPasswordInput)

                expect(status).toBe(401);
                expect(body.message).toEqual("Invalid Old Password")

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: wrongOldPasswordInput.id});
                expect(updateUserByIdMock).not.toHaveBeenCalled();
            })
        })

        describe('internal server error while updating password', () => {
            it('should return 500', async () => {

                const getUserByIdWithPassMock = jest.spyOn(UserService,"getUserByIdWithPass").mockResolvedValueOnce(getUserByIdWithPassReturn);
                const updateUserByIdMock = jest.spyOn(UserService,"updateUserById").mockImplementationOnce(() => {
                    throw new Error('Internal Server Error');
                })

                const {status,body} = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(userInput)
                expect(status).toBe(500);

                // expect(body.message).toEqual("Internal Server Error");

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: userInput.id});
                expect(updateUserByIdMock).toHaveBeenCalledWith({userId: userInput.id, userData:{password:expect.any(String)}});
            })
        })
    })
});
