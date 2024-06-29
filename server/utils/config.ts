import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8001;

export const ATT = process.env.ATT || '1m';

export const EMAIL = process.env.EMAIL || 'yashpal@gmail.com';

export const EMAIL_PASS = process.env.EMAIL_PASS || 'emailId_password';

export const PUBLIC_KEY =
    process.env.PUBLIC_KEY ||
    "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5DKkc76koePNcn9YE37F\n" +
    "TKSc7uor7XUUUaUPsM56vBGzrtBBP8tKBVilFcfKPGgNboW5vxZsrp+9Ox6EMSFU\n" +
    "eg1+kEBD4TN1wbFYpY+jyMQnfGy28dS0rjqKWmTfFJq0eag+RYV8aunsTL04RQoS\n" +
    "2uO/Uiy+16TgpYCfFStku+n5B+2eRepqymKA+F/yzjOxDoV2NIXmx3i9261Trmiz\n" +
    "+ankYl1qBMx+pc1JXOQGNvqOWy2p8sL6DKl8Rv3bL1pWlRCdW+1UCC1lZBgN3lr7\n" +
    "9XrRM/NBZSKeu9PgHt4kCDFrjcJJ0F+sBv2v3lrySMS5DnunC6q8CyNMtOupzLtt\n" +
    "5QIDAQAB\n" +
    "-----END PUBLIC KEY-----\n";

export const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkMqRzvqSh481y\n" +
    "f1gTfsVMpJzu6ivtdRRRpQ+wznq8EbOu0EE/y0oFWKUVx8o8aA1uhbm/Fmyun707\n" +
    "HoQxIVR6DX6QQEPhM3XBsVilj6PIxCd8bLbx1LSuOopaZN8UmrR5qD5FhXxq6exM\n" +
    "vThFChLa479SLL7XpOClgJ8VK2S76fkH7Z5F6mrKYoD4X/LOM7EOhXY0hebHeL3b\n" +
    "rVOuaLP5qeRiXWoEzH6lzUlc5AY2+o5bLanywvoMqXxG/dsvWlaVEJ1b7VQILWVk\n" +
    "GA3eWvv1etEz80FlIp670+Ae3iQIMWuNwknQX6wG/a/eWvJIxLkOe6cLqrwLI0y0\n" +
    "66nMu23lAgMBAAECggEAJEfG7J4FR7XTnp4Pbz4K+UX8q2FwrXadTeO7zGTvj4IS\n" +
    "+rqifRWBhbsTuBRFG3iBli5Nm0th6Rt9du5BnxwI9cS6eA23nRDU6oAbM2tUY2GI\n" +
    "U5hnN6iVN1QYVgnOi9SS1/q/N8diwg7B4mt9DEDvQXzPGK4Dg35ztuxtnmyBPfzG\n" +
    "kILhb7M4KP69srJHMKU5WIfxDmxAjC5nsXguVTFmp8MLTqGfkV4x60rCkbIe/QH8\n" +
    "E+Kw/YDwrkmqRjjc/taIxH6PeHhehX4CdtllfL/CAz+rv8h20pn8BfV8QajZHXIb\n" +
    "NYY4QNlZzX8JFxSljZdZJxz++EhqDZ1JYcIVIugrcQKBgQD7YD5zyUdGpWcykarQ\n" +
    "WGgC6ToMM59emPKCuRdK+nlUoc89FXIGbJ+zJHkb6S3cStznxNGtiMG/I9uiHW3+\n" +
    "KJFjHSBJqm2IVEghicAtPT7xDd5zwLGB7zhibFLJB7zOXjIpowaYmad5a/VQTkjp\n" +
    "M0Mscozvi9/ZTcLICRh+eNstmQKBgQDoZUAKTJBGf9dn3mwReOsExVUBmXsN4Jd1\n" +
    "CSjwVUzyyrw/TngUkUO5LUKwBtcbUA1b8u4NuwxkcC9RMPERCOjTv7KcEuVaasB/\n" +
    "heCcFvNDbSDUn/SY/ufsSikEJNM1sTDCx6AYFXM6Vh6n0Xr+CMTv2HSRghe0qMeT\n" +
    "B+Y2izX6LQKBgQC6sB+xnipxLSYXSFezo/SbNNsHdM9HUg/JRe0moh652/ItS2AD\n" +
    "pWh1gwDu2Z5VnMOy3Vlbp9U8P0U+gNzPhRF0qozwKMJwHSf0wHkZIAM+wy4SiWlL\n" +
    "Nn6JmilhY321Rf+7LHgZnQPkCWmG2p0LlCavO+OvhBIbMMUYCqlGRDuDAQKBgFGH\n" +
    "s//o/HS/RQLbtW4rzcfOsxPslI85y+jzXblzM5u6JHDRRq9whyHgDxVSUQT0ALvR\n" +
    "blLC3IYgFXmWgfxH8+bVygOXXX9rFD2o6jPYmV9+WZY+x8ElLJhpLBqYEME1eLXc\n" +
    "8v2ACPzeWcLmaw/UY8MBXWPvEAIBdILQsqNQE4/BAoGBAKsiCzZ4yp9DXIZ5480h\n" +
    "yRd3rIkp6UvH7T59XVEFiXQbCNPuYFlFT3W3yVGWwpJmZrL9UOLz6+iTVgJDmCs4\n" +
    "07D/RHkoXxYC5DGw1SvgKEC1WxAqIcxygR5pVxAh0Erv7JeqL4iqw5GJfLfdaBPr\n" +
    "vxu2Y9uOTmnaAcVE4DJQ0kJC\n" +
    "-----END PRIVATE KEY-----";
