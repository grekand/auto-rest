import color from 'colors/safe';
import config from './config';
import { IDboProcedureFunctionConfig, IDboConfig } from './config-interfaces.js';



/**
 * Mensaje mostrado cuando el servicio web se pone a la escucha.
 */
export function logExpressListen(): void {
    console.log(`Servicio web escuchando por el puerto ${color.yellow(config.express.port.toString())}.`);
}




/**
 * Muestra un mensaje indicando que se está generando el DBO's de un determinado tipo.
 * @param {string} dboType - Tipo de DBO's que se está generando.
 */
export function logTitle(dboType: string): void {
    console.log(color.yellow(`GENERANDO URL PARA ${dboType}`));
}



/**
 * Muestra un mensaje indicando que un determinado DBO ha sido generado.
 * @param {string} dboType - Tipo de DBO que se ha generado.
 * @param {string} dboName - Nombre del DBO.
 * @param {string} dboPath - Ruta del DBO.
 * @param {string} method - Método HTTP usado para la conexión.
 */
export function logDboGenerated(dboType: string, dboName: string, dboPath: string, method: string): void {
    const basePath: string = config.express.basePath === '/' ? '' : config.express.basePath;

    console.log(`URL generada: [${color.blue(dboType)}] \`${color.green(dboName)}\` como \`${color.green(dboPath)}\`.  (${color.magenta(method)}) [ ${color.yellow(`http://localhost:${config.express.port}${basePath}/${dboPath}`)} ]`);
}



/**
 * Muentra un mensaje indicando la configuración de los parámetros de un determinado DBO.
 * @param {IDboConfig<IDboProcedureFunctionConfig>} dboConfig - Configuración del DBO.
 * @param {string} dboName - Nombre del DBO.
 * @param {string[]} recordParameters - Parámetros del DBO.
 */
export function logDboParameter(dboConfig: IDboConfig<IDboProcedureFunctionConfig>, dboName: string, recordParameters: string[]): void {
    const config: IDboProcedureFunctionConfig = dboConfig.config[dboName];
    const params: { [index: string]: string } = config && config.aliasParams ? config.aliasParams : {};
    let message: string;

    for (let record of recordParameters) {
        message = `\t[${color.cyan('PARAMETRO')}] \`${color.green(record)}\``;

        if (params[record]) {
            message += ` como \`${color.green(params[record])}\`.`;
        }
        else {
            message += '.';
        }

        console.log(message);
    }
}



/**
 * Muestra un mensaje indicado que un determinado DBO ha sido ignorado.
 * @param {string} dboType - Tipo de DBO que se ha ignorado.
 * @param {string} dboName - Nombre del DBO.
 */
export function logDboIgnored(dboType: string, dboName: string): void {
    console.log(`URL ignorada: [${color.blue(dboType)}] \`${color.red(dboName)}\`.`);
}



/**
 * Muestra un mensaje indicando que ha sido imposible inicializar la API REST.
 */
export function logStartError(): void {
    console.error('Se ha producido un error que ha impedido inicializar la API REST.');
}
