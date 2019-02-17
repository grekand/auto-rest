import express, { Application, Request, Response, NextFunction, Router } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { logExpressListen } from './logs';
import config from './config';



/**
 * Contiene el servidor web.
 */
export default class ExpressServer {

    /**
     * Instancia de express.
     */
    private _app: Application;



    /**
     * Inicializa la instancia de ExpressServer.
     */
    public constructor() {
        this._app = express();

        this.addMiddlewares();
    }



    /**
     * Agregar middleware's a la instancia de express.
     */
    private addMiddlewares(): void {

        // helmet
        this._app.use(helmet());

        // body-parser
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());

        // Sólo si se está en modo de desarollo...
        if (config.mode === 'dev') {

            // Permitir cualquier origen de conexión.
            this._app.use( (req: Request, res: Response, next: NextFunction): any => {
                res.header('Access-Control-Allow-Origin', '*');
                next();
            });

        }

    }



    /**
     * Añade nuevas rutas al servicio web.
     * @param {string} path - Path base de las nuevas rutas.
     * @param {Router} router - Rutas de express.
     */
    public addRouter(path: string, router: Router): void {
        this._app.use(path, router);
    }



    /**
     * Pone el servicio web a la escucha.
     */
    public listen(): void {
        this._app.listen(config.express.port, logExpressListen);
    }

}
