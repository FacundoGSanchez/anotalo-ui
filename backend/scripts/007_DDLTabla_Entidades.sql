CREATE TABLE `Entidades` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(20) NOT NULL,
  `Nro` int NOT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Cuit` varchar(20) DEFAULT NULL,
  `Saldo` decimal(18,2) DEFAULT '0.00',
  `Activo` tinyint(1) DEFAULT '1',
  `OrganizacionId` int NOT NULL,
  `SucursalId` int DEFAULT NULL,
  `FechaAlta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Idx_Entidades_Tipo` (`Tipo`),
  KEY `Idx_Entidades_Activo` (`Activo`),
  KEY `Idx_Entidades_Organizacion` (`OrganizacionId`),
  KEY `Idx_Entidades_Sucursal` (`SucursalId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
