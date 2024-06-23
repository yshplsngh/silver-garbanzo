import supertest from 'supertest';
import * as UserService from '../services/user.service';
import { app } from '../index';
import { decodedTokenType, RegisterFormType, UserCDataType } from "../types/auth";

const userInput: RegisterFormType = {
    name: "yashpal",
    email: "yashpal@gmail.com",
    picture: "picture.png",
    password: "password",
    confirmPassword: "password",
    tac: true
};

const createUserReturnData: UserCDataType = {
    id: 1,
    email: 'yashpal@gmail.com',
    name: 'yashpal',
    picture: 'picture.png',
    verified: false,
};

const userPayload: decodedTokenType = {
    user: createUserReturnData,
    iat: expect.any(Number),
    exp: expect.any(Number)
};

describe('User', () => {
    describe('User Registration', () => {
        describe('Given the input is valid', () => {
            it('201, should return userPayload', async () => {

                /*data expecting from getUserByEmail is null*/
                const getUserMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValueOnce(null);

                /*data expecting from createNewUser is <createUserReturnData>*/
                const createUserMock = jest.spyOn(UserService, 'createNewUser').mockResolvedValueOnce(createUserReturnData);

                const { status, body } = await supertest(app).post('/api/user/register').send(userInput);

                expect(status).toBe(201);
                expect(body).toMatchObject(userPayload);

                /*data sending to getUserByEmail*/
                expect(getUserMock).toHaveBeenCalledWith({ userEmail: userInput.email });

                /*data sending to createNewUser*/
                expect(createUserMock).toHaveBeenCalledWith({ userData: userInput, hashedPass: expect.any(String) });
            });
        });

        describe('Given the input is Invalid',()=>{
            it('')
        })
    });
});
