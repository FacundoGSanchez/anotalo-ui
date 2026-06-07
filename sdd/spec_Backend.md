# SDD - Backend SQL Scripts

## Instrucciones para crear scripts de tablas, SPs CRUD e insertHandler

**Versión:** 0.1
**Fecha:** 06/06/2026
**Propósito:** Documentar el proceso y nomenclatura para solicitar la creación de nuevas entidades en la base de datos MySQL del backend .NET.

---

## 1. Esquema de Consumo API

La API .NET expone un endpoint único que recibe `{nombreProceso, jsonParam}`. Cada `nombreProceso` se resuelve contra la tabla `ProcessHandler` que mapea a un Stored Procedure.

```
POST /api/handler/consultar?request={pProceso:"SpXxx_ObtenerTodos"}
POST /api/handler/ejecutar?request={pProceso:"SpXxx_Crear", pParametros:{...}}
```

### Patrón de SPs

Todos los SPs reciben/retornan JSON:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `p_parametros` | `IN JSON` | Parámetros de entrada con prefijo `p` (ej: `pId`, `pNombre`) |
| `p_json_result` | `OUT JSON` | Resultado como JSON object o array |
| `p_result` | `OUT INT` | `1` = éxito, `0` = error |
| `p_mensaje` | `OUT VARCHAR(500)` | Mensaje descriptivo del resultado |

---

## 2. Nomenclatura de Scripts

```
{secuencia 3 dígitos}_{tipo}_{módulo}_{acción}.sql
```

| Parte | Valores | Ejemplo |
|-------|---------|---------|
| `secuencia` | `001`...`999` | `001`, `015` |
| `tipo` | `DDLTabla`, `sp`, `insertHandler` | `DDLTabla`, `sp` |
| `módulo` | Nombre de la entidad en PascalCase | `Movimientos`, `Entidades` |
| `acción` | Verbo de la operación | `Crear`, `ObtenerTodos`, `Eliminar` |

### Ejemplos

```
001_DDLTabla_Movimientos.sql
002_sp_Movimientos_ObtenerTodos.sql
003_sp_Movimientos_ObtenerPorId.sql
004_sp_Movimientos_Crear.sql
005_sp_Movimientos_Actualizar.sql
006_sp_Movimientos_Eliminar.sql
019_insertHandler_ProcessHandler.sql
```

---

## 3. Proceso para agregar una nueva entidad

### Paso 1: DDL - Crear Tabla

Archivo: `{secuencia}_DDLTabla_{Modulo}.sql`

```sql
CREATE TABLE `{Modulo}` (
  `Id` int NOT NULL AUTO_INCREMENT,
  -- campos de la entidad
  `FechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

Reglas:
- `Id` autoincremental como PK
- `FechaRegistro` con default `CURRENT_TIMESTAMP`
- Índices para campos de búsqueda frecuente
- Soft-delete: campo `Activo tinyint(1) DEFAULT 1`
- Motor `InnoDB`, charset `utf8mb4`

### Paso 2: SPs CRUD (5 archivos)

#### ObtenerTodos — `{secuencia}_sp_{Modulo}_ObtenerTodos.sql`

Retorna JSON array con todas las entidades. Soporta filtros opcionales vía JSON de entrada.

```sql
DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `Sp{Modulo}_ObtenerTodos`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_filtro VARCHAR(50);
    SET v_filtro = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFiltro'));

    SELECT JSON_ARRAYAGG(JSON_OBJECT('Id', t.Id, ...))
    INTO p_json_result
    FROM {Modulo} t
    WHERE (v_filtro IS NULL OR t.Campo = v_filtro);

    SET p_result = 1;
    SET p_mensaje = '{Modulo} obtenidos correctamente';
END$$
DELIMITER ;
```

#### ObtenerPorId — `{secuencia}_sp_{Modulo}_ObtenerPorId.sql`

Retorna JSON object con una entidad por Id.

#### Crear — `{secuencia}_sp_{Modulo}_Crear.sql`

Inserta y retorna `JSON_OBJECT('id', LAST_INSERT_ID())`.

#### Actualizar — `{secuencia}_sp_{Modulo}_Actualizar.sql`

UPDATE con `COALESCE(v_campo, Campo)` para actualización parcial.

#### Eliminar — `{secuencia}_sp_{Modulo}_Eliminar.sql`

DELETE físico o UPDATE `Activo = 0` para borrado lógico.

### Paso 3: insertHandler — Registrar SPs

Archivo: `{secuencia}_insertHandler_ProcessHandler.sql`

```sql
INSERT INTO `AnotaloDB`.`ProcessHandler` (`n_proceso`, `procedure_name`)
VALUES ({codigo_modulo}1, 'Sp{Modulo}_ObtenerTodos');
INSERT INTO `AnotaloDB`.`ProcessHandler` (`n_proceso`, `procedure_name`)
VALUES ({codigo_modulo}2, 'Sp{Modulo}_ObtenerPorId');
INSERT INTO `AnotaloDB`.`ProcessHandler` (`n_proceso`, `procedure_name`)
VALUES ({codigo_modulo}3, 'Sp{Modulo}_Crear');
INSERT INTO `AnotaloDB`.`ProcessHandler` (`n_proceso`, `procedure_name`)
VALUES ({codigo_modulo}4, 'Sp{Modulo}_Actualizar');
INSERT INTO `AnotaloDB`.`ProcessHandler` (`n_proceso`, `procedure_name`)
VALUES ({codigo_modulo}5, 'Sp{Modulo}_Eliminar');
```

Rango de `n_proceso` por módulo:

| Módulo | Rango |
|--------|-------|
| Movimientos | 1001-1005 |
| Entidades | 2001-2005 |
| Usuarios | 3001-3005 |
| *(nuevo)* | 4001-4005 |

---

## 4. Convenciones

| Concepto | Regla |
|----------|-------|
| Naming SP | `Sp{Modulo}{Accion}` en PascalCase |
| Prefijo params | `p` + nombre (ej: `pNombre`, `pFechaDesde`) |
| Variables locales | `v_` + nombre (ej: `v_nombre`) |
| Definición SP | `DEFINER=anotalo_user@%` |
| Delimitador | `DELIMITER $$` ... `$$` ... `DELIMITER ;` |
| Fechas | `timestamp NULL DEFAULT CURRENT_TIMESTAMP` |
| Moneda | `decimal(18,2)` |
| Booleanos | `tinyint(1)` con `DEFAULT '1'` |
| Strings | `varchar(100)`/`varchar(200)` |

---

## 5. Referencia

- Scripts existentes: `backend\scripts\`
- Ejemplo completo de tabla + SPs + handler: módulos `Movimientos` (001-006), `Entidades` (007-012), `Usuarios` (013-018)
- `backend\it\_Seguimiento.md` — documentación de endpoints y autenticación API
