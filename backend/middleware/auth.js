import  jwt from "jsonwebtoken";
import express from "express";
import crypto from "crypto";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

// load the jwt JWT_SECRET_KEY, expire_time
let expire_time  = process.env.ACCESS_TOKEN_EXPIRE_MINUTES;
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
let refresh_token_expire = process.env.REFRESH_TOKEN_EXPIRE_DAYS;
let JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

// const token = crypto.randomBytes(32).toString('hex');
// console.log(token);

const create_token = (data)=>{
    try{
        
        const token = jwt.sign(data, JWT_SECRET_KEY, {
            expiresIn: expire_time
        })

        return token
    }
    catch(error){
           
        console.log(error);

        throw new Error("Token creation failed");
    }
}

const verifytoken = (req, res, next) => {

    try {

        // get authorization header
        const authHeader = req.headers.authorization;

        // check token exists
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                success: false,
                message: "No token is provided"
            });
        }

        // extract token
        const token = authHeader.split(" ")[1];
        // console.log(token);

        // verify token
        const decodedToken = jwt.verify(

            token,

            JWT_SECRET_KEY
        );

        // attach user
        req.user = decodedToken;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


const refresh_token = (data)=>{
    try{
        
        const token = jwt.sign(data, JWT_REFRESH_SECRET_KEY, {
            expiresIn: expire_time
        })

        return token
    }
    catch(error){
           
        console.log(error);

        throw new Error("Token creation failed");
    }
}

export {create_token,verifytoken,refresh_token};
