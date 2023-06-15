const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const bodyParser = require("body-parser");
const messagesRoutes = require("./routes/messages-routes");
const authRoutes = require("./routes/auth-routes");
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
    origin: "exp://192.168.143.176:19000"
  },
});



///

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
});

app.use("/send", messagesRoutes);
app.use("/auth", authRoutes);
app.use("/getuser", authRoutes);

mongoose
    .connect("mongodb+srv://work:21436587@cluster0.cq41rgq.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(8000, () => {
          console.log("listening on port 8000");
          ///
          server.listen(3007, () => {
            io.on("connection", (socket) => {
              console.log(`User Connected: ${socket.id}`);
              messagesControllers.storeSocket(socket);
              socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
              });
            });
            console.log("SERVER RUNNING");
          });
          ///
        });
    })
    .catch(err => {
        console.log("there was error");
    });