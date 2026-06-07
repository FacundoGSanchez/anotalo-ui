CREATE TABLE `Licencias` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OrganizacionId` int NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaVencimiento` date NOT NULL,
  `Tipo` varchar(50) DEFAULT 'STANDARD',
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Idx_Licencias_Organizacion` (`OrganizacionId`),
  KEY `Idx_Licencias_Activo` (`Activo`),
  CONSTRAINT `Fk_Licencias_Organizacion` FOREIGN KEY (`OrganizacionId`) REFERENCES `Organizaciones` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
