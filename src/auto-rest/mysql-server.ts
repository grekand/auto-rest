import mysql, { Pool, PoolConnection, MysqlError, FieldInfo } from 'mysql';
import { Request, Response, RequestHandler } from 'express';
import MySqlServerQueries, { IQuery } from './mysql-server-queries.js';
import config from './config';



/**
 * Establece la conexión con la BBDD y permite realizar consultas sobre esta.
 */
export default class MySqlServer {

    /**
     * Contiene la instancia de MySqlServer.
     */
    private static _mysqlServer: MySqlServer;



    /**
     * Contiene la instancia del pool de conexiones.
     */
    private _pool: Pool;



    /**
     * Obtiene el pool de conexiones.
     */
    public get pool(): Pool {
        return this._pool;
    }



    /**
     * Inicializa la instancia de MySqlServer.
     */
    private constructor() {
        
        // Crear pool de conexiones.
        this._pool = mysql.createPool({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            port: config.mysql.port,
            database: config.mysql.database,
            charset: config.mysql.charset,
            connectionLimit: config.mysql.connectionLimit,
            acquireTimeout: config.mysql.acquireTimeout,
            queryFormat: MySqlServer.queryFormat
        });

    }



    /**
     * Devuelve la instancia de MySqlServer.
     */
    public static getInstance(): MySqlServer {
        return this._mysqlServer || (this._mysqlServer = new this());
    }



    /**
     * Establece el formato en que se van a recibir los parámetros.
     * @param {string} query - Consulta de BBDD.
     * @param {any} params - Parámetros de la consulta.
     */
    private static queryFormat(query: string, params: any): string {
        let result: string;

        if (!params) {
            result = query;
        } else {
            result = query.replace(/\:(\w+)/g, function(query: string, key: string) {
                let result: string;

                if (params.hasOwnProperty(key)) {
                    result = mysql.escape(params[key]);
                } else {
                    result = query;
                }

                return result;
            }.bind(this));
        }

        return result;
    }



    /**
     * Ejecuta una consulta de BBDD.
     * @param {IQuery} query - Consulta con formato IQuery.
     */
    private executeQuery(query: IQuery): Promise<any[]> {
        return new Promise<string[]>( (resolve: Function, reject: Function) => {
            const instance = MySqlServer.getInstance();

            instance.pool.getConnection( (error: MysqlError, connection: PoolConnection) => {
                if (error) {
                    reject(error);
                }
                else {
                    connection.query(query.query, query.params, (error: MysqlError | null, results?: any): void => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            const data: any[] = results ? query.callback(results) : [];

                            resolve(data);
                        }
                    });
                }
            });

        });
    }
    


    /**
     * Solicitud para servidores express.
     * @param {string} query - Consulta de BBDD.
     */
    public static expressQuery(query: string): RequestHandler {
        return (request: Request, response: Response) => {
            const mysqlServer: MySqlServer = MySqlServer.getInstance();

            mysqlServer.pool.getConnection( (err: MysqlError, conn: PoolConnection) => {

                if (err) {
                    console.error(err);
                    response.status(500).json(err);
                }
                else {
                    let params: any = null;

                    if (request.method === 'GET') {
                        params = request.params;
                    }
                    else {
                        params = request.body;
                    }

                    conn.query(query, params, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                        if (err) {
                            response.status(500).json(err);
                        }
                        else {
                            response.json(results);
                        }
                    });
                }

                conn.release();

            });
            
        };
    }
    



    /**
     * Obtiene un array de tablas que contiene la BBDD.
     */
    public getTables(): Promise<any> {
        return this.executeQuery(MySqlServerQueries.showTables);
    }



    /**
     * Obtiene un array de vistas que contiene la BBDD.
     */
    public getViews(): Promise<any> {
        return this.executeQuery(MySqlServerQueries.showViews);
    }



    /**
     * Obtiene un array de procedimientos que contiene la BBDD.
     */
    public getProcedures(): Promise<any> {
        return this.executeQuery(MySqlServerQueries.showProcedures);
    }



    /**
     * Obtiene un array de funciones que contiene la BBDD.
     */
    public getFunctions(): Promise<any> {
        return this.executeQuery(MySqlServerQueries.showFunctions);
    }

}
