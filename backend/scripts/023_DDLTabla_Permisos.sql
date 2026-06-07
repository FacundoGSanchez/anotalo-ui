CREATE TABLE `Permisos` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Codigo` varchar(50) NOT NULL,
  `Descripcion` varchar(300) DEFAULT NULL,
  `Modulo` varchar(50) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uk_Permisos_Codigo` (`Codigo`),
  KEY `Idx_Permisos_Modulo` (`Modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
