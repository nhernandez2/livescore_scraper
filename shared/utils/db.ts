import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';

const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

class Database {
  private static instance: Database;
  private connection: Connection;

  private constructor() {
    this.connection = mysql.createPool(dbConfig);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(sql: string, values?: any[]): Promise<any> {
    try {
      const [rows, fields] = await this.connection.execute(sql, values);
      return rows;
    } catch (error) {
      throw new Error(`Error executing query: ${error}`);
    }
  }

  public async close(): Promise<void> {
    await this.connection.end();
  }
}

export default Database.getInstance();
