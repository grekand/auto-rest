import express, { Router } from 'express';
import MySqlServer from './mysql-server';
import { IDboConfig, IDboTableViewConfig, IDboElementConfig, IDboProcedureFunctionConfig } from './config-interfaces';
import { logTitle, logDboGenerated, logDboIgnored, logDboParameter } from './logs';
import config from './config';



/**
 * Comprueba si un DBO aparecerá en el servicio web.
 * @param {IDboConfig} dboConfig - Configuración establecida para el tipo de entidad.
 * @param {string} dboName - Nombre de la entidad.
 */
function mustBeCreated(dboConfig: IDboConfig<IDboElementConfig>, dboName: string): boolean {
    return (dboConfig.include === 'all' && !dboConfig.except[dboName])
        || (dboConfig.include === 'none' && dboConfig.except[dboName]);
}



/**
 * Obtiene la ruta que tendrá el DBO en la URL de acceso.
 * @param {IDboTableViewConfig} dboConfig - Configuración establecida para el tipo de entidad.
 * @param {string} dboName - Nombre de la entidad.
 */
function getDboPath(dboConfig: IDboConfig<IDboElementConfig>, dboName: string): string {
    const conf: IDboTableViewConfig = dboConfig.config[dboName];
    let result: string = '';

    if (dboConfig.prefix && (!conf || (conf && !conf.ignorePrefix))) {
        result += dboConfig.prefix.trim();
    }
    
    if (conf && conf.alias) {
        result += conf.alias;
    }
    else {
        result += dboName;
    }

    return encodeURIComponent(result);
}



function getParameters(dboConfig: IDboConfig<IDboProcedureFunctionConfig>, dboName: string, parameters: string[]): string {
    const config: IDboProcedureFunctionConfig = dboConfig.config[dboName];
    const params: { [index: string]: string } = config && config.aliasParams ? config.aliasParams : {};
    let result: string[] = parameters.map( (parameter: string) => `:${params[parameter] ? params[parameter] : parameter}`);

    return result.join(', ');
}



/**
 * Genera un Router de express con todas las rutas de la BBDD.
 */
export default function ApiRouter(): Promise<Router> {
    return new Promise<Router>( (resolve: Function, reject: Function) => {
        const router: Router = express.Router();
        const sqls: MySqlServer = MySqlServer.getInstance();
        let dboPath;
        
        Promise.all([

            // Tablas
            sqls.getTables().then( (data: any) => {
                const dboConfig: IDboConfig<IDboTableViewConfig> = <IDboConfig<IDboTableViewConfig>>config.build.tables;

                logTitle('TABLAS');

                for (let record of data) {
                    
                    if (mustBeCreated(dboConfig, record.table)) {
                        dboPath = getDboPath(dboConfig, record.table);
                        router.get(`/${dboPath}`, MySqlServer.expressQuery(`SELECT * FROM \`${record.table}\``));
                        
                        logDboGenerated('TABLA', record.table, dboPath, 'GET');
                    }
                    else {
                        logDboIgnored('TABLA', record.table);
                    }
                }

                console.log();

            }).catch( (error) => {
                console.error(error);
            }),

            

            // Vistas
            sqls.getViews().then( (data: any) => {
                const dboConfig: IDboConfig<IDboTableViewConfig> = <IDboConfig<IDboTableViewConfig>>config.build.views;

                logTitle('VISTAS');

                for (let record of data) {
                    
                    if (mustBeCreated(dboConfig, record.view)) {
                        dboPath = getDboPath(dboConfig, record.view);
                        router.get(`/${dboPath}`, MySqlServer.expressQuery(`SELECT * FROM \`${record.view}\``));
                        
                        logDboGenerated('VISTA', record.view, dboPath, 'GET');
                    }
                    else {
                        logDboIgnored('VISTA', record.view);
                    }
                }

                console.log();

            }).catch( (error) => {
                console.error(error);
            }),

            

            // Procedimientos
            sqls.getProcedures().then( (data: any) => {
                const dboConfig: IDboConfig<IDboProcedureFunctionConfig> = <IDboConfig<IDboProcedureFunctionConfig>>config.build.procedures;
                let params: string;

                logTitle('PROCEDIMIENTOS');

                for (let record of data) {
                    
                    if (mustBeCreated(dboConfig, record.procedure)) {
                        dboPath = getDboPath(dboConfig, record.procedure);
                        params = getParameters(dboConfig, record.procedure, record.parameters);
                        router.post(`/${dboPath}`, MySqlServer.expressQuery(`CALL \`${record.procedure}\`(${params})`));
                        
                        logDboGenerated('PROCEDIMIENTO', record.procedure, dboPath, 'POST');
                        logDboParameter(dboConfig, record.procedure, record.parameters);
                    }
                    else {
                        logDboIgnored('PROCEDIMIENTO', record.procedure);
                    }
                }

                console.log();

            }).catch( (error) => {
                console.error(error);
            }),

            

            // Funciones
            sqls.getFunctions().then( (data: any) => {
                const dboConfig: IDboConfig<IDboProcedureFunctionConfig> = <IDboConfig<IDboProcedureFunctionConfig>>config.build.functions;
                let params;

                logTitle('FUNCIONES');

                for (let record of data) {
                    
                    if (mustBeCreated(dboConfig, record.function)) {
                        dboPath = getDboPath(dboConfig, record.function);
                        params = getParameters(dboConfig, record.function, record.parameters);
                        router.post(`/${dboPath}`, MySqlServer.expressQuery(`SELECT \`${record.function}\`(${params}) AS \`result\``));
                        
                        logDboGenerated('FUNCION', record.function, dboPath, 'POST');
                        logDboParameter(dboConfig, record.function, record.parameters);
                    }
                    else {
                        logDboIgnored('FUNCION', record.function);
                    }
                }

                console.log();

            }).catch( (error) => {
                console.error(error);
            })

        ]).then(() => {
            resolve(router);
        }).catch(() => {
            reject('Imposible cargar los datos');
            process.exit(1);
        });

    });
};
