CREATE TABLE `ProspectoConsultas` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Apellido` varchar(100) DEFAULT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `RazonSocial` varchar(150) DEFAULT NULL,
  `Cargo` varchar(100) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Mensaje` text,
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
