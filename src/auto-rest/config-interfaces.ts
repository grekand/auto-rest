/**
 * Interfaz con la estructura de la configuración base de cualquier DBO.
 */
export interface IDboElementConfig {
    alias?: string;
    ignorePrefix?: boolean;
}



/**
 * Interfaz con la estructura de la configuración exclusiva de cualquier tabla o vista de la BBDD.
 */
export interface IDboTableViewConfig extends IDboElementConfig {

}



/**
 * Interfaz con la estructura de la configuración exclusiva de cualquier procedimiento o función de la BBDD.
 */
export interface IDboProcedureFunctionConfig extends IDboElementConfig {
    aliasParams?: { [index: string]: string }; 
}



/**
 * Interfaz con la estructura de la configuración de cualquier DBO.
 */
export interface IDboConfig<T extends IDboElementConfig> {
    prefix: string | null;
    include: "all" | "none";
    except: { [index: string]: boolean };
    config: { [index: string]: T };
}
