CREATE TABLE `Sucursales` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OrganizacionId` int NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Direccion` varchar(300) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Idx_Sucursales_Organizacion` (`OrganizacionId`),
  KEY `Idx_Sucursales_Activo` (`Activo`),
  CONSTRAINT `Fk_Sucursales_Organizacion` FOREIGN KEY (`OrganizacionId`) REFERENCES `Organizaciones` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
