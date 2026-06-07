CREATE TABLE `Usuarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `Mail` varchar(150) DEFAULT NULL,
  `Nombre` varchar(200) DEFAULT NULL,
  `Rol` varchar(50) DEFAULT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uk_Usuarios_Username` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
