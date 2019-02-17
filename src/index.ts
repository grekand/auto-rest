import { Router } from 'express';
import ExpressServer from './auto-rest/express-server';
import ApiRouter from './auto-rest/api-router';
import config from './auto-rest/config';

const express: ExpressServer = new ExpressServer();

ApiRouter().then( (router: Router) => {
    express.addRouter(config.express.basePath, router);
    express.listen();
});
