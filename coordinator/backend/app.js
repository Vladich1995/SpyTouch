const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const agentsRoutes = require("./routes/agents-routes");
const usersRoutes = require("./routes/users-routes");
const messagesRoutes = require("./routes/messages-routes");
const messagesControllers = require("./controllers/messages-controllers");

///
const app2 = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());


const server = http.createServer(app);

let io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  },
});


app.use(bodyParser.json({limit: '50mb'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });


app.use("/addagent", agentsRoutes);
app.use("/deleteagent", agentsRoutes);
app.use("/getagents", agentsRoutes);

app.use("/adduser", usersRoutes);
app.use("/getuser", usersRoutes);

app.use("/storemessage", messagesRoutes);
app.use("/getmessages", messagesRoutes);
app.use("/request", messagesRoutes);
app.use("/agent", agentsRoutes);

app.use("/message", messagesRoutes);

mongoose
    .connect("mongodb+srv://work:21436587@cluster0.cq41rgq.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(5000);
        ///

        server.listen(3005, () => {
          messagesControllers.storeFrontIO(io);
          io.on("connection", (socket) => {
            console.log(`User Connected to backend: ${socket.id}`);
            messagesControllers.storeSocket(socket);
            socket.on("disconnect", () => {
              console.log("User Disconnected from backend", socket.id);
            });
          });
          console.log("SERVER RUNNING");
        });
        ///
    })
    .catch(err => {
        console.log("there was error");
    });