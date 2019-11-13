import * as chai from 'chai';
import * as supertest from 'supertest'
import * as express from 'express';
import {Logger} from 'brologger';
import logger from '../src/index'

describe('#Logger', () => {

    const {expect} = chai;

    let app;

    before(() => {
        app = express();
        app.use(logger({loggerInstance: new Logger()}));
        app.get('/201', (req, res, next) =>{
            return res.sendStatus(201);
        });
        app.get('/200', (req, res, next) =>{
            return res.sendStatus(200);
        });
        app.get('/400', (req, res, next) =>{
            return res.sendStatus(400);
        });
        app.get('/500', (req, res, next) =>{
            return res.sendStatus(500);
        });
    });

    it('200', (done)=>{
        supertest(app)
            .get('/200')
            .then((res: supertest.Response)=>{
                done();
            })
            .catch(done);

    });
    it('201', (done)=>{
        supertest(app)
            .get('/201')
            .then((res: supertest.Response)=>{
                done();
            })
            .catch(done);

    });
    it('400', (done)=>{
        supertest(app)
            .get('/400')
            .then((res: supertest.Response)=>{
                done();
            })
            .catch(done);

    });
    it('500', (done)=>{
        supertest(app)
            .get('/500')
            .then((res: supertest.Response)=>{
                done();
            })
            .catch(done);

    });

});