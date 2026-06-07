CREATE TABLE `RolPermiso` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RolId` int NOT NULL,
  `PermisoId` int NOT NULL,
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uk_RolPermiso` (`RolId`, `PermisoId`),
  KEY `Idx_RolPermiso_Permiso` (`PermisoId`),
  CONSTRAINT `Fk_RolPermiso_Rol` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`Id`),
  CONSTRAINT `Fk_RolPermiso_Permiso` FOREIGN KEY (`PermisoId`) REFERENCES `Permisos` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
