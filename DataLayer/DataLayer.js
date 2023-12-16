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

    
    async getMessage(idMessage){
        let result = [];
        let sql = "SELECT * FROM Message WHERE idMessage = ?;";
            const rows = await this.query(sql, [idMessage]);
            return rows;
    }

    async getLast10Messages(parentChat){
        let result = [];
        let sql = "SELECT * FROM Message WHERE parentChat = ? ORDER BY timeStamp DESC LIMIT 10;";
            const rows = await this.query(sql, [parentChat]);
            return rows;
    }

    async createChat(idGame, time){
        let result = [];
        let sql = "INSERT INTO Chat (idGame, timeStamp) VALUES (?, ?);";
            const rows = await this.query(sql, [idGame, time]);
            return rows;
    }    

    async createMessage(idAuthor, time, parentChat, content){
        let result = [];
        let sql = "INSERT INTO Message (idAuthor, timeStamp, parentChat, content) VALUES (?, ?, ?, ?);";
            const rows = await this.query(sql, [idAuthor, time, parentChat, content]);
            return rows;
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