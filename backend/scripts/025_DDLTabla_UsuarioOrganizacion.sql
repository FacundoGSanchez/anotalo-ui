CREATE TABLE `UsuarioOrganizacion` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UsuarioId` int NOT NULL,
  `OrganizacionId` int NOT NULL,
  `RolId` int NOT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uk_UsuarioOrganizacion` (`UsuarioId`, `OrganizacionId`),
  KEY `Idx_UsuarioOrganizacion_Organizacion` (`OrganizacionId`),
  KEY `Idx_UsuarioOrganizacion_Rol` (`RolId`),
  CONSTRAINT `Fk_UsuarioOrganizacion_Usuario` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuarios` (`Id`),
  CONSTRAINT `Fk_UsuarioOrganizacion_Organizacion` FOREIGN KEY (`OrganizacionId`) REFERENCES `Organizaciones` (`Id`),
  CONSTRAINT `Fk_UsuarioOrganizacion_Rol` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
