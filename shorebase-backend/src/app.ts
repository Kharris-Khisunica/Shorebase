import "reflect-metadata"
import express from 'express';
import session from 'express-session';

import hellloRoutes from './routes/helloRoutes.mjs';
import { errorHandler } from './middlewares/errorHandler.mjs';
import config from "./config/config";
import cors from 'cors';

import userRoute from './routes/general/userRoutes';
import positionJobTitle from './routes/position/jobTitleRoutes';
import userPosition from './routes/position/userPositionRoutes';
import approvalWorkflowRoute from './routes/position/approvalWorkflowRoutes';
import generalCompany from './routes/general/companyRoutes';
import generalJobPosition from './routes/general/jobPositionRoutes';
import uom from './routes/service/uomRoutes';
import shorebaseService from './routes/service/shorebaseServiceRoutes'
import sumCalc from './routes/service/sumCalcRoutes'
import contract from './routes/contract/contractRoute'
import subContractor from './routes/contract/subContractorRoute'
import shorebaseServicePrice from './routes/service/shorebaseServicePriceRoutes'
import shorebaseServiceProduct from './routes/service/shorebaseServiceProductRoutes'
import shorebaseServiceType from './routes/service/shorebaseServiceTypeRoutes'
import contractService from './routes/contract-service/contractServiceRoutes'
import contractServicePrice from './routes/contract-service/contractServicePriceRoutes'
import activityStatus from './routes/activity/activityStatusRoutes';
import activity from './routes/activity/activityRoutes';
import planActivity from './routes/activity/planActivityRoutes'
import actualActivity from './routes/activity/actualActivityRoutes'
import roomType from './routes/activity/roomTypeRoutes';
import equipment from './routes/activity/equipmentRoutes';
import timesheetType from './routes/timesheet/timesheetTypeRoutes'
import timesheet from './routes/timesheet/timesheetRoutes'
import timesheetActivity from './routes/timesheet/timesheetActivityRoutes'

import summaryTimesheet from './routes/summary/summaryTimesheetRoutes'
import stComponent from './routes/summary/stComponentRoutes'
import stTimesheet from "./routes/summary/stTimesheetRoutes";

import { keycloak, sessionStore } from "./services/keycloak";

import mqttClient from './services/keycloakMQTT';
console.log('Keycloak MQTT Listener Connected: ', mqttClient.connected);

const app = express();
app.use(cors({
    origin: config.frontendHost,
    credentials: true
}));


app.use(express.json());

app.get('/', (req, res) => {
    console.log('halo');
    res.send({ ok: true })
})

// Keycloak
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// app.use(keycloak.middleware());
app.use(keycloak.middleware( { logout: '/logout'} ));

// User and Positions
app.use('/position/job-title', positionJobTitle);
app.use('/position/user-position', userPosition);
app.use('/position/approval/workflow', approvalWorkflowRoute);

app.use('/general/user', userRoute);
app.use('/general/company', generalCompany);
app.use('/general/job-position', generalJobPosition);

//Service
app.use('/contract-service/service/product', shorebaseServiceProduct);
app.use('/contract-service/service/uom', uom);
app.use('/contract-service/service/sum-calc', sumCalc);
app.use('/contract-service/service/price', shorebaseServicePrice);
app.use('/contract-service/service/type', shorebaseServiceType)
app.use('/contract-service/service', shorebaseService )

//Contract
app.use('/contract-service/contract/sub-contractor', subContractor)
app.use('/contract-service/contract', contract)

// Contract Service
app.use('/contract-service/price', contractServicePrice)
app.use('/contract-service', contractService)

// Activity
app.use('/activity/status', activityStatus)
app.use('/activity/equipment', equipment)
app.use('/activity/room-type', roomType)
app.use('/activity/actual', actualActivity)
app.use('/activity/plan', planActivity)
app.use('/activity', activity)

// Timesheet
app.use('/timesheet/type', timesheetType)
app.use('/timesheet/activity', timesheetActivity)
app.use('/timesheet', timesheet)

// Summary
// app.use('/summary/timesheet', stTimesheet)
app.use('/summary-timesheet/detail', stComponent)
app.use('/summary-timesheet', summaryTimesheet)

// Routes
app.get('/unprotected', (req, res) => {
    res.send('<h3>Unprotected</h3>');
});

app.get('/protected', keycloak.protect(), (req, res) => {
    res.send('<h3>Protected</h3>');
});

app.get('/shorebase', keycloak.protect('realm:shorebase'), (req, res) => {
    res.send('<h3>Shorebase protected</h3>');
});

app.use('/api/hello', hellloRoutes);



// Global error handler
app.use(errorHandler);


export default app;