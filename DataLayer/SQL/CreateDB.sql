USE Battleship;

DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;



CREATE TABLE `Player` (
	`idPlayer` INT AUTO_INCREMENT,
	`username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `permissionLVL` TINYINT,
    `inGame` INT NOT NULL DEFAULT 1,	
	PRIMARY KEY (`idPlayer`)
);


CREATE TABLE `Game` (
  `idGame` INT AUTO_INCREMENT,
  `idBlue` INT NOT NULL,
  `idRed` INT NOT NULL,
  `bOcean` JSON,
  `rOcean` JSON,
  `bTarget` JSON,
  `rTarget` JSON,
  `gameState` INT NOT NULL,
  `winner` INT,
  `currentTurn` INT,
  PRIMARY KEY (`idGame`),
  FOREIGN KEY (idBlue) REFERENCES Player(idPlayer),
  FOREIGN KEY (idRed) REFERENCES Player(idPlayer)
  );
  
  
  CREATE TABLE `Chat` (
  `idChat` INT AUTO_INCREMENT,
  `idGame` INT, 
  `timeStamp` DATETIME NOT NULL,
  PRIMARY KEY (`idChat`),
  FOREIGN KEY (`idGame`) REFERENCES Game(idGame)
  );
  
CREATE TABLE `Message` (
  `idMessage` INT AUTO_INCREMENT,
  `idAuthor` INT NOT NULL, 
  `timeStamp` DATETIME NOT NULL,
  `parentChat` INT NOT NULL,
  `content` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idMessage`),
  FOREIGN KEY (`idAuthor`) REFERENCES Player(idPlayer),
  FOREIGN KEY (`parentChat`) REFERENCES Chat(idChat)
  );
  
 
  
  
  INSERT INTO Player (username, password, permissionLVL) VALUES ('RealDean','$2b$10$6CcBFq3GR090jQsHXCY2YOKbUhIlBbN5VAFLwtBdA5vydQ5PIXMg.',1);
  INSERT INTO Player (username, password, permissionLVL) VALUES ('NotBrenden','$2b$10$kGkDfHGoQYDyBA1eT7ErnOESbnBvNgMEk9mpOCGHo/h6FteUZrpIi',2);
  INSERT INTO Game (idBlue, idRed, bOcean, rOcean, bTarget, rTarget, gameState) VALUES (1, 2,'{}','{}','{}','{}',0);
  INSERT INTO Chat (timestamp) VALUES (NOW());
  INSERT INTO Message(idAuthor,timestamp,parentChat,content) VALUES (1,NOW(),1,"This is dean's message or something");
 
  
  

