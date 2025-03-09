// import the express application and type definition
import express, { Express } from "express";
// Importing morgan
import morgan from "morgan";

// import setupSwagger endpoint
import setupSwagger from "../config/swagger";

//importing branch and employee routes
import loanRoute from "./api/v1/routes/loanRoutes"

import adminRoute from "./api/v1/routes/adminRoutes"; 
import userRoute from "./api/v1/routes/userRoutes";   


//importing error handler from middleware directory
import errorHandler from "./api/v1/middleware/errorHandler";

//initilizes the application
const app: Express = express();

// setup swagger for api documentation
setupSwagger(app);

// Use morgan for HTTP request logging
app.use(morgan("combined"));

// used to parse json
app.use(express.json());



// health check
app.get("/api/v1/health", (req, res) => {
	res.json({
		status: "OK",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		version: "1.0.0",
	});
});


app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/users", userRoute);

//using employee and branch routes 
app.use("/api/v1/loans",loanRoute)


//uses the imported error handdler last
app.use(errorHandler);


// export server for testing
export default app;