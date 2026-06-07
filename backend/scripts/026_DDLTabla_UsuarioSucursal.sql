CREATE TABLE `UsuarioSucursal` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UsuarioId` int NOT NULL,
  `SucursalId` int NOT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uk_UsuarioSucursal` (`UsuarioId`, `SucursalId`),
  KEY `Idx_UsuarioSucursal_Sucursal` (`SucursalId`),
  CONSTRAINT `Fk_UsuarioSucursal_Usuario` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuarios` (`Id`),
  CONSTRAINT `Fk_UsuarioSucursal_Sucursal` FOREIGN KEY (`SucursalId`) REFERENCES `Sucursales` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
