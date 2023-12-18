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

    async updatePlayerInGame(idPlayer, idGame){
        let sql = "UPDATE Player SET inGame = ? WHERE idPlayer = ?;";
            const rows = await this.query(sql, [idGame, idPlayer]);
            return rows;
    }

    async updateGameState(idGame, gameState){
        let sql = "UPDATE Game SET gameState = ? WHERE idGame = ?;";
            const rows = await this.query(sql, [gameState, idGame]);
            return rows;
    }

    async getGame(idGame){
        let sql = "SELECT * FROM Game WHERE idGame = ?;";
            const rows = await this.query(sql, [idGame]);
            return rows;
    }

    async createGame(idBlue, idRed, gameState){
        let sql = "INSERT INTO Game (idBlue, idRed, gameState) VALUES (?, ?, ?);";
            const rows = await this.query(sql, [idBlue, idRed, gameState]);
            return rows;
    }

    async getMessage(idMessage){
        let sql = "SELECT * FROM Message WHERE idMessage = ?;";
            const rows = await this.query(sql, [idMessage]);
            return rows;
    }

    async getLast10Messages(parentChat){
        let sql = "SELECT Message.idAuthor, Message.timeStamp, Message.content, Player.username FROM Message INNER JOIN Player ON Message.idAuthor = Player.idPlayer WHERE parentChat = ? ORDER BY timeStamp DESC LIMIT 10;";
            const rows = await this.query(sql, [parentChat]);
            return rows;
    }

    async createChat(idGame, time){
        let sql = "INSERT INTO Chat (idGame, timeStamp) VALUES (?, ?);";
            const rows = await this.query(sql, [idGame, time]);
            return rows;
    }    

    async createMessage(idAuthor, time, parentChat, content){
        let sql = "INSERT INTO Message (idAuthor, timeStamp, parentChat, content) VALUES (?, ?, ?, ?);";
            const rows = await this.query(sql, [idAuthor, time, parentChat, content]);
            return rows;
    }

    async getPlayerID(idPlayer  ){
        let sql = "SELECT * FROM Player WHERE idPlayer = ?;";
            const rows = await this.query(sql, [idPlayer]);
            return rows;
    }

    async getPlayer(username){
        let sql = "SELECT * FROM Player WHERE username = ?;";
            const rows = await this.query(sql, [username]);
            return rows;
    }

    async getPlayers(){
        let sql = "SELECT * FROM Player;";
            const rows = await this.query(sql);
            return rows;   
    }

    async updatePlayerInGame(idPlayer, idGame){
        let sql = "UPDATE Player SET inGame = ? WHERE idPlayer = ?;";
            const rows = await this.query(sql, [idGame, idPlayer]);
            return rows;
    }

    async createPlayer(username, password){
        let sql = "INSERT INTO Player (username, password) VALUES (?, ?);";
            const rows = await this.query(sql, [username, password]);
            return rows;
    }

}