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
        app.get('/', (req, res, next) =>{
            return res.sendStatus(201);
        })
    });

    it('1', (done)=>{
        supertest(app)
            .get('/')
            .then((res: supertest.Response)=>{
                done();
            })
            .catch(done);

    });

});