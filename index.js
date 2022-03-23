const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const bodyParser  = require("body-parser")
const http  = require("http");
const socketIo = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 8800;

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
// app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(bodyParser.json({limit: "7mb"}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: "7mb", extended: false}));
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: "*",
  })
);

// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback ) => {
//       // if(whitelist.includes(origin || ""))
//       //     return callback(null, true)
//       //
//       // callback(new Error('Not allowed by CORS'));
//       // console.log("origin: ", origin);
//       callback(null, true); // everyone is allowed
//   }
// };

// app.use(cors(corsOptions));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => {
  console.log("Backend server is running!");
});
