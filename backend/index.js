const express = require("express");
const { DBConnection } = require("./database/db");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

DBConnection();

app.use(express.json()); // some middelwares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world, is coming from backend index.js");
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//REGISTER Functionality

app.post("/register", async (req, res) => {
  try {
    //get all the data from the frontend(firstname,lastname,...etc)
    const { firstname, lastname, email, password } = req.body; //initially all this data will be stored in req.body
    //this is destructing method in ES6

    //check if all the fields have been filled by the user or not
    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the information/fields");
    }

    //More validation(check format of email)
    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    //check if user already exists
    /* user kidhar milega--> database me..so we create another folder db  
  user ki email is unique so we can check if the user is unique or not using his email*/
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send("User already exists with the same email!");
    }

    //hashing or encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //save the user in the database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword, // dont write hashedpassword here...write like password: hashedPassword
    });

    //generate a token for user and send it to the backend

    /*we will generate a token using JWT which has header,payload and signature in it
  header contains info about how jwt is encoded and which algo we want to use 
  payload is what the user will be sending(your information)
  signature checks that it has not been tampered*/
    // npm i jsonwebtoken

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;
    res
      .status(200)
      .json({ message: "You have successfully registered!", user });
  } catch (error) {
    console.log(error);
  }
});

//LOGIN Functionality

app.post("/login", async (req, res) => {
  try {
    // get data from user
    const { email, password } = req.body;

    //check if all the fields have been filled by the user or not
    if (!(email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    //add more verifications
    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    //find the user in the database
    const user = await User.findOne({ email }); //database calling so we need await
    if (!user) {
      return res.status(404).send("User not found!");
    }

    //check the password
    const enteredPassword = await bcrypt.compare(password, user.password);
    if (!enteredPassword) {
      return res.status(404).send("Password is incorrect");
    }

    //generate a token for user and send it to the backend
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;

    //now we have to store this token
    //cookies is the best way to store token and not local storage and session storage
    //so store token in cookies with options
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //cookies expires in this time
      httpOnly: true, //cookie can only be manipulated by server not by client/user
    };

    //send the token
    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}!`);
});
