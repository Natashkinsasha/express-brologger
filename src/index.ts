import * as express from 'express';
import {Logger} from 'brologger';


export default ({loggerInstance}: { loggerInstance: Logger }) => (req: express.Request, res: express.Response & { body: any }, next: express.NextFunction) => {
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks: any[] = [];
    res.write = (...restArgs: any[]) => {
        chunks.push(Buffer.from(restArgs[0]));
        return defaultWrite.apply(res, restArgs);
    };
    res.end = (...restArgs: any[]) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const buffer = Buffer.concat(chunks).toString('utf8');
        if (buffer && isJson(buffer)) {
            res.body = JSON.parse(buffer);
        } else {
            res.body = buffer;
        }
        return defaultEnd.apply(res, restArgs);
    };
    res.on('finish', () => {
        const message = `HTTP ${res.statusCode} ${req.method} ${req.url}`;
        loggerInstance
            .message(message)
            .object(clean(
                {
                    req: {url: req.url, method: req.method, headers: req.headers, body: req.body},
                    res: {statusCode: res.statusCode, body: res.body}
                })
            )
            .log(getLevelByStatusCode(res.statusCode))
    });
    next();
}

function getLevelByStatusCode(statusCode: number) {
    if (statusCode >= 100 && statusCode < 400) {
        return 'info';
    }
    if (statusCode >= 400 && statusCode < 500) {
        return 'warn';
    }
    return 'error';
}

function clean(obj: object) {
    return JSON.parse(JSON.stringify(obj));
}


function isJson(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}