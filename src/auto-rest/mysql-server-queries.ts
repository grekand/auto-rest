import config from './config';



/**
 * Interfaz con la estructura de la respuesta base de todos los getters de MySqlServerQueries.
 */
export interface IQuery {
    query: string;
    params: object;
    callback: Function;
}



/**
 * Contiene las consultas para montar automáticamente la API REST.
 */
export default class MySqlServerQueries {

    /**
     * Consulta que obtiene las tablas de la BBDD indicada en la configuración.
     */
    public static get showTables(): IQuery {

        return {
            query: "SELECT `TABLE_NAME` AS `table` FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = :schema",
            params: {
                schema: config.mysql.database
            },
            callback(data: any): any {
                return data.map( (record: any) => {
                    return {
                        table: record.table
                    };
                });
            }
        };

    }



    /**
     * Consulta que obtiene las vistas de la BBDD indicada en la configuración.
     */
    public static get showViews(): IQuery {

        return {
            query: "SELECT `TABLE_NAME` AS `view` FROM `information_schema`.`VIEWS` WHERE `TABLE_SCHEMA` = :schema",
            params: {
                schema: config.mysql.database
            },
            callback(data: any): any {
                return data.map( (record: any) => {
                    return {
                        view: record.view
                    };
                });
            }
        };

    }



    /**
     * Consulta que obtiene los procedimientos de la BBDD indicada en la configuración.
     */
    public static get showProcedures(): IQuery {

        return {
            query: "SELECT `SPECIFIC_NAME` AS `procedure`, GROUP_CONCAT(`PARAMETER_NAME` ORDER BY `ORDINAL_POSITION` ASC SEPARATOR ';') AS `parameters` FROM `information_schema`.`PARAMETERS` WHERE `SPECIFIC_SCHEMA` = :schema AND `ROUTINE_TYPE` = 'PROCEDURE' GROUP BY `SPECIFIC_NAME`",
            params: {
                schema: config.mysql.database
            },
            callback(data: any): any {
                return data.map( (record: any) => {
                    return {
                        procedure: record.procedure,
                        parameters: record.parameters ? record.parameters.split(';') : []
                    };
                });
            }
        };
        
    }



    /**
     * Consulta que obtiene las funciones de la BBDD indicada en la configuración.
     */
    public static get showFunctions(): IQuery {

        return {
            query: "SELECT `SPECIFIC_NAME` AS `function`, GROUP_CONCAT(`PARAMETER_NAME` ORDER BY `ORDINAL_POSITION` ASC SEPARATOR ';') AS `parameters` FROM `information_schema`.`PARAMETERS` WHERE `SPECIFIC_SCHEMA` = :schema AND `ROUTINE_TYPE` = 'FUNCTION' GROUP BY `SPECIFIC_NAME`",
            params: {
                schema: config.mysql.database
            },
            callback(data: any): any {
                return data.map( (record: any) => {
                    return {
                        function: record.function,
                        parameters: record.parameters ? record.parameters.split(';') : []
                    };
                });
            }
        };

    }

}
