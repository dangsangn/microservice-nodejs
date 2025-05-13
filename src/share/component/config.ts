import dotenv from 'dotenv';

dotenv.config();

export const config = {
  rpc: {
    productBrand: process.env.RPC_PRODUCT_BRAND_URL || 'http://localhost:3333/api',
    productCategory: process.env.RPC_PRODUCT_CATEGORY_URL || 'http://localhost:3333/api',
  },
  accessToken: {
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
    expiresIn: '7d',
  },
};
