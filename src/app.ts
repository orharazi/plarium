import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import http from 'http';

class Server {
    private app: Express;
    public appListener: http.Server | undefined;
    private port: number;
    private routesDirectory: string;

    constructor() {
        this.app = express(); // Creating express app
        this.routesDirectory = path.join(__dirname, 'routes'); // Used later when exposing our routes
        this.port = Number(process.env.PORT) || 3000; // Defalut port is 3000, you can change it from env
    }

    async start(): Promise<void> {
        // Serving our app on our port
        this.appListener = this.app.listen(this.port, () => {
            console.log(
                `Plarium API is running at http://localhost:${this.port}`
            );
        });

        // Few steps that require for our app
        try {
            await this.setupRoutes(); // Setup all routes
            this.useReadmeAsRoot(); // Show README.md in the root route
            this.errorHandling(); // Handle errors on while making requests to the api
        } catch (_error) {
            this.appListener.close();
            // Catch for any errors on start() function
            const error = _error as Error;
            throw Error(
                `Error while running server: ${error.name}: ${error.message}, ${error.stack}`
            );
        }
    }

    close(): void {
        if (this.appListener) {
            this.appListener.close();
        }
    }

    /**
     * Make every file in /routes directory to route with the name of the file.
     * Exmaple: user.ts will be route localhost:3000/user.
     * The router exported from this file will be used under this route.
     */
    private async setupRoutes() {
        const files = fs.readdirSync(this.routesDirectory);
        for (const file of files) {
            const fileExtention = file.split('.').at(-1); // Last string after "." always will be fileExtention. Example: or.harazi.ts => ts
            if (['ts', 'js'].includes(fileExtention!)) {
                const routePath = `/${file.replace(`.${fileExtention}`, '')}`;
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
