import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 9000;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'krzIlmMEGG9Ql7jT+sn2zgDew387pzCzUQCtKrewqUou7+gLYuAOMZtjbQdIjqECdcrAPzkm9yM4wOFfIYw4zukroFmj7ic76TzQB6ZRpBQEMHQZP82IR0Ye73lqysbKfGQUn/2i7twZxAV1ZpnXhUPuDmMdu+Y7GpNKH3IFmJ8='
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'mc+8o+qVXV2SehCC1PUmE0TODOdXsMunG9zEE6+egY3V6lVw00xLnPMfOvSJV7Fl+65R7zaSSml49Y4s7AWSQDpO0af6GslelpjF6X8RqqfZ1dndzE67q2pGE1jFkR5n1ZdGPUP9L93Udq+91+aKe8gmYMSQVqlCRbPYfDbWWZQ='
export const NODE_ENV = 'development';

