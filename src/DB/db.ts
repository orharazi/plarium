import { Pool, QueryResult } from 'pg';
import Config from '../DB/config';
import { DbConfig } from './config';

class DBConnection {
    private pool: Pool;

    constructor(config: DbConfig | undefined) {
        if (!config) {
            throw Error(
                'No config given, check for this environment variables: PORT, PG_HOST, PG_DB, PG_USER, PG_PASS, PG_PORT,'
            );
        } else {
            this.pool = new Pool(config);
        }
    }

    /**
     * This function let us connect to our DB only when users make requests,
     * then we run our query and when we finish - we disconnect.
     * @param queryText - Our query
     * @param params - Optional parameters for our query
     * @returns - Data from our query
     */
    async query(queryText: string, params?: any[]): Promise<QueryResult<any>> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryText, params);
            return result;
        } finally {
            client.release();
        }
    }
}

export default new DBConnection(Config);
