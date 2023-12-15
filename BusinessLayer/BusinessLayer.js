import { DataLayer } from "../DataLayer/DataLayer.js";

var data = new DataLayer();



export class BusinessLayer{

    constructor(){
        this.dataLayer = new DataLayer();
    }


    async getPlayers(){
        return await this.dataLayer.getPlayers();
    }

}