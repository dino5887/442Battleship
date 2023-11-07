USE Battleship;

DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS Message;

CREATE TABLE `Player` (
	`idPlayer` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `idSession` INT NOT NULL,
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
  
  
  
  INSERT INTO Player (username, password, idSession, permissionLVL) VALUES (`RealDean`,`BycrytpTHIS`,`430243`,1);
  INSERT INTO Player (username, password, idSession, permissionLVL) VALUES (`NotBrenden`,`BycrytpTHISTOO`,`430343`,2);
  INSERT INTO Game (idBlue, idRed, ) VALUES (`RealDean`,`BycrytpTHIS`,`43043`,2);
  
  

