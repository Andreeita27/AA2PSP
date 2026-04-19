import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        // Guardamos el tiempo de inicio de la petición
        const start = Date.now();

        // Cuando la respuesta termina (muy importante)
        res.on('finish', () => {

            // Calculamos el tiempo total de ejecución
            const duration = Date.now() - start;

            // Construimos el log
            const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`;

            // Mostrar por consola
            console.log(log);

            // Guardar en fichero logs.txt
            // __dirname apunta a la carpeta actual del archivo
            // subimos niveles para dejarlo en la raíz del proyecto
            const logFilePath = path.join(__dirname, '../../../logs.txt');

            fs.appendFile(logFilePath, log + '\n', (err) => {
                if (err) {
                    console.error('Error escribiendo en logs.txt', err);
                }
            });
        });

        // Continuamos con la petición
        next();
    }
}