import supertest from 'supertest';
import * as UserService from '../services/user.service';
import * as OTPService from '../services/otp.service'
import {app} from '../index';
import {
    decodedTokenType,
    PasswordFormType,
    RegisterFormType,
    SendOTPType,
    UserCDataType,
    VerifyOTPType
} from "../types/auth";
import {signJWT} from "../utils/jwtUtils";
import {ATT} from "../utils/config";
import {OTPDataType} from "../services/otp.service";

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

const accessToken = signJWT({user: createUserReturnData}, {expiresIn: ATT})


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

        describe('User register successfully', () => {
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

        /**
         * Hashed oldPassword is stored in DB, so we need to create a hash of that password to mimic database result.
         * coz inside endpoint userInput old_password is compare with DB old password,
         * so we need to provide already hashed password
         */

        const getUserByIdWithPassReturn = {
            id: userInput.id,
            password: "$2b$10$YKccvcqASvBncHIdY7vneeWu7mhAoU64iBxyOvTLU22Uu0BJg/8ya"
        };

        describe('Given the input is Invalid', () => {
            it('should return 422', async () => {
                const invalidUserInput = {...userInput, newConfirmPassword: 'different_password'};

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

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: userInput.id});
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

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(wrongOldPasswordInput)

                expect(status).toBe(401);
                expect(body.message).toEqual("Invalid Old Password")

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: wrongOldPasswordInput.id});
                expect(updateUserByIdMock).not.toHaveBeenCalled();
            })
        })

        describe('internal server error while updating password', () => {
            it('should return 500', async () => {

                const getUserByIdWithPassMock = jest.spyOn(UserService, "getUserByIdWithPass").mockResolvedValueOnce(getUserByIdWithPassReturn);
                const updateUserByIdMock = jest.spyOn(UserService, "updateUserById").mockImplementationOnce(() => {
                    throw new Error('Internal Server Error');
                })

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(userInput)
                expect(status).toBe(500);

                expect(body.message).toEqual("Internal Server Error");

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: userInput.id});
                /**
                 * On endpoint after hashing $new_password, hashed can be anything,
                 * so we have to expect any String, for @@updateUserById function.
                 * */
                expect(updateUserByIdMock).toHaveBeenCalledWith({
                    userId: userInput.id,
                    userData: {password: expect.any(String)}
                });
            })
        })

        describe('password change successfully', () => {
            it('should return 200', async () => {
                const getUserByIdWithPassMock = jest.spyOn(UserService, 'getUserByIdWithPass').mockResolvedValueOnce(getUserByIdWithPassReturn)
                const updateUserByIdMock = jest.spyOn(UserService, 'updateUserById').mockResolvedValueOnce({email: createUserReturnData.email})

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/resetPassword').set("authorization", `${accessToken}`).send(userInput);

                expect(status).toBe(200);
                expect(body.message).toEqual("Password change successfully")

                expect(getUserByIdWithPassMock).toHaveBeenCalledWith({userId: userInput.id});
                /**
                 * On endpoint after hashing $new_password, hashed can be anything,
                 * so we have to expect any String, for @@updateUserById function.
                 */
                expect(updateUserByIdMock).toHaveBeenCalledWith({
                    userId: userInput.id,
                    userData: {password: expect.any(String)}
                })
            })
        })
    })

    describe('My Profile Data', () => {
        describe('Tokens are valid', () => {
            it('should return 200', async () => {
                const {status, body} = await supertest(app).get('/api/user/me').set("authorization", `${accessToken}`);
                expect(status).toBe(200);
                expect(body).toMatchObject(userPayload)
            })
        })
        describe('Token is invalid', () => {
            it('should return 435', async () => {

                /**
                 * here we are making AT invalid by replacing with random words.
                 */
                const {
                    status,
                    body
                } = await supertest(app).get('/api/user/me').set("authorization", `${accessToken}`.replace('p', 'x'));
                expect(status).toBe(435);
                expect(body.message).toEqual("Unauthorized")

            })
        })
    })

    describe('Sending OTP', () => {
        const userInput:SendOTPType = {
            userId: 1,
            email: 'yashpal9rx@gmail.com'
        }
        /**
         * random $otp will create and its hashed can be anything,
         * while providing it to @@function
         */
        const createNewOTPInput = {
            userId: userInput.userId,
            hashedOTP: expect.any(String)
        }
        /**
         * we will get $otp from DB which is $hashedOTP while sending it to function
         */
        const createNewOTPOutput: Omit<OTPDataType, 'createdAt' | 'updatedAt'> = {
            id: 1,
            otp: expect.any(String),
            UserId: userInput.userId
        }

        describe('given OTP input is invalid', () => {
            it('should return 422', async () => {
                const invalidUserInput = {...userInput, email: "invalid_email"}
                const createNewOTPMock = jest.spyOn(OTPService, 'createNewOTP').mockRejectedValueOnce('oh no createNewOTP is called')

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/sendOTP').set('authorization', `${accessToken}`).send(invalidUserInput);

                expect(status).toBe(422);
                expect(body.message).toEqual("Invalid email")
                expect(createNewOTPMock).not.toHaveBeenCalled()
            })
        })
        describe('creating OTP in DB failed', () => {
            it('should return 500', async () => {

                const createNewOTPMock = jest.spyOn(OTPService, 'createNewOTP').mockImplementationOnce(() => {
                    throw new Error('Internal Server Error');
                })

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/sendOTP').set('authorization', `${accessToken}`).send(userInput);

                expect(status).toBe(500);
                expect(body.message).toEqual("Internal Server Error");

                expect(createNewOTPMock).toHaveBeenCalledWith(createNewOTPInput);
            });
        })
        describe('OTP send successfully', () => {
            it('should return 201', async () => {
                const createNewOTPMock = jest.spyOn(OTPService, 'createNewOTP').mockResolvedValueOnce(createNewOTPOutput)

                const {
                    status,
                    body
                } = await supertest(app).post('/api/user/sendOTP').set('authorization', `${accessToken}`).send(userInput);
                expect(status).toBe(201);
                expect(body.message).toEqual("Email send Successfully");

                expect(createNewOTPMock).toHaveBeenCalledWith(createNewOTPInput);
            })
        })
    })

    describe("Verifying OTP", () => {
        const userInput:VerifyOTPType = {
            userId: 1,
            otp:'7217'
        }
        const getUserByIdOutput:UserCDataType = {
            id: 1,
            email: 'yashpal@gmail.com',
            name: 'yashpal',
            picture: 'picture.png',
            verified: false,
        }

        /**
         * setting created time to 15 min past to check endpoint,
         * coz otp check for 10 min,
         */
        const fifteenMinPast = new Date(new Date().getTime()-15*60*1000)

        /**
         * setting created time to 2 min past, it can be anything b/w 1-10,
         * but here we take OTP is now 2 min OLD
         */
        const twoMinPast = new Date(new Date().getTime()-2*60*1000)

        /**
         * we will get hashed OTP from DB
         */
        const getUserLatestOTPOutput:OTPDataType = {
            id:1,
            otp:'$2b$10$oP2rbYPf1NpxgeEp8J.9Nu99xetZ1i9De.DqRvghQvCkuseSJl7hO',//7217
            UserId: userInput.userId,
            updatedAt:twoMinPast,
            createdAt:twoMinPast
        }
        describe("given OTP input is invalid",()=>{
            it('should return 422', async () => {
                const invalidUserInput = {...userInput,otp:'invalid_OTP'}

                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockRejectedValueOnce('oh no getUserById is called');
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockRejectedValueOnce('oh no getUserLatestOTP is called');
                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockRejectedValueOnce('oh no deleteManyOTP is called');
                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockRejectedValueOnce('oh no updateUserById is called');

                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(invalidUserInput);
                expect(status).toBe(422);
                expect(body.message).toEqual("OTP must be exactly 4 characters long");

                expect(getUserByIdMock).not.toHaveBeenCalled()
                expect(getUserLatestOTPMock).not.toHaveBeenCalled()
                expect(deleteManyOTPMock).not.toHaveBeenCalled()
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            })
        })

        describe('given userId does not exist', () => {
            it('should return 404', async () => {
                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockResolvedValueOnce(null);
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockRejectedValueOnce('oh no getUserLatestOTP is called');
                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockRejectedValueOnce('oh no deleteManyOTP is called');
                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockRejectedValueOnce('oh no updateUserById is called');

                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(userInput);

                expect(status).toBe(404);
                expect(body.message).toEqual("User not found");

                expect(getUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(getUserLatestOTPMock).not.toHaveBeenCalled()
                expect(deleteManyOTPMock).not.toHaveBeenCalled()
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            });
        })

        describe('given userId, No OTP exist',()=>{
            it('should return 404', async () => {
                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockResolvedValueOnce(getUserByIdOutput);
                /**
                 * for given user no OTP exist, so function return $null,
                 * that's why we are expecting $null here
                 */
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockResolvedValueOnce(null);

                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockRejectedValueOnce('oh no deleteManyOTP is called');

                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockRejectedValueOnce('oh no updateUserById is called');
                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(userInput);

                expect(status).toBe(404);
                expect(body.message).toEqual("Account record does not exist or verified already, please Sign up");

                expect(getUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(getUserLatestOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(deleteManyOTPMock).not.toHaveBeenCalled()
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            })
        })

        describe('Latest OTP is more than 10 min OLD',()=>{
            it('should return 410', async () => {
                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockResolvedValueOnce(getUserByIdOutput);

                /**
                 * providing createdAt to 15 min, get an error
                 * coz limit is 10 min
                 */
                const invalidGetUserLatestOTPOutput = {...getUserLatestOTPOutput,createdAt:fifteenMinPast,updatedAt: fifteenMinPast};
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockResolvedValueOnce(invalidGetUserLatestOTPOutput);

                /**
                 * prisma deleteMany return a count variable, tells how many fields are deleted,
                 * so it can be anything,
                 */
                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockResolvedValueOnce({count:expect.any(Number)});
                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockRejectedValueOnce('oh no updateUserById is called');

                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(userInput);

                expect(status).toBe(410);
                expect(body.message).toEqual("OTP is expired, please Request new OTP!");

                expect(getUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(getUserLatestOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(deleteManyOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            })
        })

        describe('given User OTP does not match with DB OTP',()=>{
            it('should return 400', async () => {

                /**
                 * DB contain hashed OTP of 7217, but here we are proving 8000 to check,
                 */
                const invalidUserInput:VerifyOTPType = {...userInput,otp:'8000'};

                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockResolvedValueOnce(getUserByIdOutput);
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockResolvedValueOnce(getUserLatestOTPOutput);

                /**
                 * this time we don't want to run deleteManyOTP function coz time is 2 min,
                 * which is under 10 min,
                 */
                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockRejectedValueOnce('oh no deleteManyOTP is called');
                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockRejectedValueOnce('oh no updateUserById is called');

                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(invalidUserInput);

                expect(status).toBe(400);
                expect(body.message).toEqual("Invalid OTP passed, check your inbox");

                expect(getUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(getUserLatestOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(deleteManyOTPMock).not.toHaveBeenCalled();
                expect(updateUserByIdMock).not.toHaveBeenCalled()
            })
        })

        describe('OTP verified successfully',()=>{
            it('should return 201', async () => {

                const getUserByIdMock = jest.spyOn(UserService,'getUserById').mockResolvedValueOnce(getUserByIdOutput);
                const getUserLatestOTPMock = jest.spyOn(OTPService,'getUserLatestOTP').mockResolvedValueOnce(getUserLatestOTPOutput);
                const deleteManyOTPMock = jest.spyOn(OTPService,'deleteManyOTP').mockResolvedValueOnce({count:expect.any(Number)});
                const updateUserByIdMock = jest.spyOn(UserService,'updateUserById').mockResolvedValueOnce({email:"yashpal@gmail.com"});

                const {status,body} = await supertest(app).post('/api/user/verifyOTP').set('authorization', `${accessToken}`).send(userInput);

                expect(status).toBe(201);
                expect(body.message).toEqual("Account verified");

                expect(getUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(getUserLatestOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(deleteManyOTPMock).toHaveBeenCalledWith({userId:userInput.userId})
                expect(updateUserByIdMock).toHaveBeenCalledWith({userId:userInput.userId,userData:{verified: true}})
            })
        })

    })
});
