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

    async getPlayer(username){
        let result = [];
        let sql = "SELECT * FROM Player WHERE username = ?;";
            const rows = await this.query(sql, [username]);
            return rows;
    }

    async getPlayers(){
        let result = [];
        let sql = "SELECT * FROM Player;";
            const rows = await this.query(sql);
            return rows;   
    }

    async createPlayer(username, password){
        let result = [];
        let sql = "INSERT INTO Player (username, password) VALUES (?, ?);";
            const rows = await this.query(sql, [username, password]);
            return rows;
    }

}