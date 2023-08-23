import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import MongoDBConnection from './DB/db';

class Server {
    private app: Express;
    private port: number;
    private routesDirectory: string;

    constructor() {
        this.app = express();
        this.routesDirectory = path.join(__dirname, 'routes');
        this.port = Number(process.env.PORT) || 3000;
    }

    async start(): Promise<void> {
        const server = this.app.listen(this.port, () => {
            console.log(
                `Plarium API is running at http://localhost:${this.port}`
            );
        });
        try {
            const DB_URI: string = process.env.DB_URI || '';
            const dbConnection = new MongoDBConnection(DB_URI);

            await dbConnection.connect(); //connect to mongoDB
            await this.setupRoutes(); // setup all routes
            this.useReadmeAsRoot(); // show README.md in the root route
            this.errorHandling(); // handle errors on while making requests to the api
        } catch (_error) {
            server.close();
            // catch for any errors on start() function
            const error = _error as Error;
            throw Error(
                `Error while running server: ${error.name}: ${error.message}, ${error.stack}`
            );
        }
    }

    /**
     *  Make every file in /routes directory to route with the name of the file.
     * Exmaple: user.ts will be route localhost:3000/user.
     * The router exported from this file will be used under this route.
     */
    private async setupRoutes() {
        const files = fs.readdirSync(this.routesDirectory);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                const routePath = `/${file.replace('.ts', '')}`;
                const routeModule = await import(
                    path.join(this.routesDirectory, file)
                );
                if (routeModule.default) {
                    this.app.use(routePath, routeModule.default);
                }
            }
        }
    }

    /**
     * This function turn the readme.md file to html served on the root page of the api.
     */
    private useReadmeAsRoot() {
        this.app.get('/', (req: Request, res: Response) => {
            const readmePath = path.join(__dirname, '../README.md');
            fs.readFile(readmePath, 'utf8', (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .send('Error reading README.md' + readmePath);
                }

                const markdownHtml = marked(data);
                res.send(markdownHtml);
            });
        });
    }

    /**
     * This function will catch all error occured by users request.
     * 404 errors and middleware errors.
     */
    private errorHandling() {
        // Handling 404 Not Found
        this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
            const error: any = new Error('Not Found');
            error.status = 404;
            res.status(error.status).json({
                error: {
                    message: error.message,
                },
            });
        });

        // Error handling middleware
        this.app.use(
            (error: any, req: Request, res: Response, next: NextFunction) => {
                res.status(error.status || 500).json({
                    error: {
                        message: error.message,
                    },
                });
            }
        );
    }
}

export default Server;
