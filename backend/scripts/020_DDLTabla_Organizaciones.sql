CREATE TABLE `Organizaciones` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(200) NOT NULL,
  `NombreCorto` varchar(50) DEFAULT NULL,
  `Cuit` varchar(20) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Idx_Organizaciones_Activo` (`Activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
