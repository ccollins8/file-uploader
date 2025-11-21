const indexRouter = require("./routes/indexRouter");
const fileRouter = require("./routes/fileRouter");

const path = require("node:path");
const express = require("express");
const session = require('express-session');
const passport = require("passport");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const app = express()

app.use(
  session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

require('./config/passport'); 

app.use("/", indexRouter);
app.use("/", fileRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));




