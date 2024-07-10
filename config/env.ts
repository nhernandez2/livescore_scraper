import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface EnvConfig {
    port: number;
    domain: string;
    base_api_livescore: string;
    api_search: string;
}

const envConfig: EnvConfig = {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    domain: process.env.DOMAIN || 'https://www.livescore.com',
    base_api_livescore: process.env.BASE_API_LIVESCORE || '',
    api_search: process.env.API_SEARCH || ''
};

export default envConfig;