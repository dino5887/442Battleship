import { DataLayer } from "../DataLayer/DataLayer.js";
import bcrypt, { hash } from 'bcrypt';
import {check, validationResult} from 'express-validator';
var data = new DataLayer();



export class BusinessLayer{

    constructor(){
        this.dataLayer = new DataLayer();
    }


    async createPlayer(username, password){
        
        //password length validation
        check(username).isLength({min: 1, max: 20}).withMessage("Username must be between 1 and 20 characters");
        check(password).isLength({min: 8, max: 20}).withMessage("Password must be between 8 and 20 characters");
        password = await bcrypt.hash(password, 10);
        //username unique validation
        let exsists = await this.dataLayer.getPlayer(username);
        if(exsists.length > 0){
            throw new Error("Username already taken");
        }

        try{
            let result = await this.dataLayer.createPlayer(username, password);
            return result;
        } catch (error){
            console.log(error);
        }
    }


    async login(username, pass){

        let result = null;
        result = await this.dataLayer.getPlayer(username);
        if(result.length == 0){
            throw new Error("Invalid credentials");
        } else if (result.length == 1){
            let valid = await bcrypt.compare(pass, result[0].password);
            if(valid){
                return result[0];
            } else{
                throw new Error("Password does not match");
            }
        } else{
            throw new Error("Database error: more than one user with same username");
        }
    };


    async getUser(username){
        let result = null;
        result = await this.dataLayer.getPlayer(username);
        if(result.length == 0){
            throw new Error("User Does not Exist");
        } else if (result.length == 1){
            return result[0];
        }
    }
    

    async getPlayers(){
        let result = await this.dataLayer.getPlayers();
        if(result.length == 0){
            throw new Error("No Players");
        } else{
        return result;
        }
    }

}

