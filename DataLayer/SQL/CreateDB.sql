USE Battleship;

DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;



CREATE TABLE `Player` (
	`idPlayer` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `permissionLVL` TINYINT,
    `InGame` INT,	
	PRIMARY KEY (`idPlayer`)
);


CREATE TABLE `Game` (
  `idGame` INT NOT NULL AUTO_INCREMENT,
  `idBlue` INT NOT NULL, 
  `idRed` INT NOT NULL,
  `bOcean` JSON NOT NULL,
  `rOcean` JSON NOT NULL,
  `bTarget` JSON NOT NULL,
  `rTarget` JSON NOT NULL,
  `gameState` INT NOT NULL,
  `winner` INT,
  `currentTurn` INT,
  PRIMARY KEY (`idGame`),
  FOREIGN KEY (idBlue) REFERENCES Player(idPlayer),
  FOREIGN KEY (idRed) REFERENCES Player(idPlayer)
  );
  
  
  CREATE TABLE `Chat` (
  `idChat` INT NOT NULL AUTO_INCREMENT,
  `idGame` INT, 
  `timeStamp` DATETIME NOT NULL,
  PRIMARY KEY (`idChat`),
  FOREIGN KEY (`idGame`) REFERENCES Game(idGame)
  );
  
CREATE TABLE `Message` (
  `idMessage` INT NOT NULL AUTO_INCREMENT,
  `idAuthor` INT NOT NULL, 
  `timeStamp` DATETIME NOT NULL,
  `parentChat` INT NOT NULL,
  PRIMARY KEY (`idMessage`),
  FOREIGN KEY (`idAuthor`) REFERENCES Player(idPlayer),
  FOREIGN KEY (`parentChat`) REFERENCES Chat(idChat)
  );
  
  
  
  INSERT INTO Player (username, password, permissionLVL) VALUES ('RealDean','$2b$10$6CcBFq3GR090jQsHXCY2YOKbUhIlBbN5VAFLwtBdA5vydQ5PIXMg.',1);
  INSERT INTO Player (username, password, permissionLVL) VALUES ('NotBrenden','$2b$10$kGkDfHGoQYDyBA1eT7ErnOESbnBvNgMEk9mpOCGHo/h6FteUZrpIi',2);
  INSERT INTO Game (idBlue, idRed, bOcean, rOcean, bTarget, rTarget, gameState) VALUES (1, 2,'{}','{}','{}','{}',0);
  
  

