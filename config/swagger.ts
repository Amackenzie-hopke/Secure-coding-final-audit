import swaggerUi from "swagger-ui-express";
import swaggerJsDoc, { Options } from "swagger-jsdoc";

// import swagger ui middleware, jsdoc library
import { Express } from "express";

// define swagger options
const swaggerOptions: Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
		},
	},
	//routes too the api doc files
	apis: ["./src/app.ts", "./src/api/v1/controllers/*.ts", "./src/api/v1/routes/*.ts"], 
};
// Initialize Swagger JSDoc object
// eslint: suppress eslint error for using "any" type on following line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swaggerDocs: any = swaggerJsDoc(swaggerOptions);

// serve swagger in apiDocs directory
const setupSwagger = (app: Express): void => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

// export swagger endpoint for Express app
export default setupSwagger;