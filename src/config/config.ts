import { config } from 'dotenv';

config();

if (!process.env.PORT) {
  console.error('No PORT provided');
  process.exit(1);
}

if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
  console.error('==> No MONGO specification provided');
  process.exit(1);
}

export const { PORT, ENV } = process.env;

const { WEB_URL, WEB_TEST_URL } = process.env;
const URL = ENV === 'dev' ? WEB_TEST_URL : WEB_URL;
export { URL as WEB_URL };

export const { JWT_SECRET, JWT_LIFETIME } = process.env;

export const { COOKIE_SIGNATURE } = process.env;

export const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGO_DATABASE } = process.env;

export const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

// TODO: production URL: `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mongodb:27017/?authSource=admin`

export const { ETHEREAL_USERNAME, ETHEREAL_PASSWORD } = process.env;

export const { DEFAULT_PRODUCT_IMAGE_URL, DEFAULT_BLOG_IMAGE_URL } = process.env;
