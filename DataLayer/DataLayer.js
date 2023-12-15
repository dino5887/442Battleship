import mysql from 'mysql';
import util from 'util';

function getConnection(){
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Tucker3113$$",
    database: "battleship"
});
return connection;
};

export class DataLayer{
    
    constructor(){
        this.connection = getConnection();
        this.query = util.promisify(this.connection.query).bind(this.connection);
    }


    async getPlayers(){
        let result = [];
        let sql = "SELECT * FROM Player;";
        try{
            const rows = await this.query(sql);
            result[0] = 'success';
            result[1] = rows;
            return rows;
        } catch (err){
            result[0] = 'failure';
            result[1] = err;
            return result;
        }
    }
    
    }