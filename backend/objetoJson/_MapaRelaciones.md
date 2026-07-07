# Mapa de Relaciones entre Objetos

## 1. Diagrama de Relaciones

```
LoginResponse
 ├── token: string
 ├── sessionId: string
 ├── usuario ────────────────────────────► Usuario.json
 │     └── roles[] ───► Rol.json
 │                         └── permisos[] ──► Permiso.json
 ├── organizaciones[] ───────────────────► Organizacion.json
 │     ├── sucursalDefault
 │     ├── FormasPago ──► FormaPago.json     ──► ConfigOrg.json
 │     │     ├── Venta[]
 │     │     ├── Pago[]
 │     │     └── Cobro[]
 │     └── TiposMovimiento[]
 └── sucursales[] ───────────────────────► Sucursal.json

ConfigOrg.json (org_config_<orgId>)
 ├── formasPago ──► FormaPago.json
 ├── rubros[] ────► Rubro.json
 └── configPOS ───► ConfigPOS.json

Movimiento.json
 ├── tipo: enum(Venta|Pago|Cobro|Ingreso|Retiro)
 ├── formaPagos[] ──────────────────────► MovimientoFormaPago (nombre + importe)
 ├── lineItems[] ───────────────────────► LineItem.json
 │     └── rubro ───────────────────────► Rubro.json
 ├── entidad ──── { id, nombre } ───────► Cliente.json | Proveedor.json
 └── sucursalId ────────────────────────► Sucursal.json

Cliente.json
 ├── ctaCteConfig ──────────────────────► CtaCteConfig.json
 └── activo (soft-delete)

UsuarioSistema.json (usuarios_db)
 └── sucursales[] ──► Sucursal.json

Cierre.json
 └── usuario ───────────────────────────► Usuario.json (por nombre)
```

## 2. Impacto del Auth Response en Módulos

| Objeto | Campo | Módulos/Páginas que lo consumen |
|--------|-------|----------------------------------|
| `usuario.nombre` | nombre del usuario | AppHeader, CardUser, movimiento (usuario que registró) |
| `usuario.roles[]` | IDs de roles | can() en AuthContext → permisos en toda la app |
| `organizaciones[].id` | ID de organización | useCurrentOrg → todos los orgService |
| `organizaciones[].nombre` | nombre de org | MainLayout, AppHeader |
| `organizaciones[].sucursalDefault` | sucursal por defecto | useCurrentSucursal al cambiar de org |
| `organizaciones[].FormasPago` | formas de pago x tipo | → initOrgConfig() → localStorage ConfigOrg |
| `organizaciones[].TiposMovimiento` | tipos de movimiento | Posibles filtros futuros |
| `rolesData[].permisos[]` | modulo/formulario/accion | **AppRouter**: PermissionRoute (CONFIG/pos, rubros, formas-pago, sucursales, usuarios)<br>**MenuList**: oculta/muestra items del menú<br>**MoreMenuPage**: filtro de página mobile |
| `sucursales[]` | lista de sucursales | useCurrentSucursal, CardUser (selector UI) |

## 3. Impacto de ConfigOrg en Módulos

| Objeto | Campo | Módulos/Páginas que lo consumen |
|--------|-------|----------------------------------|
| `formasPago.Venta[]` | array de FormaPago | **POS Anotalo** StepFormaPago: lista de selección<br>**POS Anotalo** StepEntidad: requiereEntidad<br>**AdminCajaPage**: filtro impactaCaja |
| `formasPago.Pago[]` | array de FormaPago | **AdminComprasPage**: selector forma de pago |
| `formasPago.Cobro[]` | array de FormaPago | **DetalleCtaCtePage**: selector cobro |
| `rubros[]` | array de Rubro | **POS Anotalo** StepImporte: selector rubro x item<br>**POS Anotalo** StepConfirmar: muestra sigla/nombre<br>**RubrosConfigPage**: CRUD de rubros |
| `configPOS.usaRubro` | boolean | **POS Anotalo** StepImporte: oculta/muestra UI de rubro, modal, badges, botón editar |

## 4. Impacto de Config por Entidad en Módulos

| Objeto | Campo | Módulos/Páginas que lo consumen |
|--------|-------|----------------------------------|
| `cliente.ctaCteConfig.habilitado` | boolean | **EntidadForm**: toggle switch<br>**EntidadesListado**: tag "CTA CTE"<br>**AdminCtaCtePage**: warning si no config |
| `cliente.ctaCteConfig.importeMaximo` | number | **AdminCtaCtePage**: alerta sobreLimite<br>**DetalleCtaCtePage**: alerta + edición |
| `cliente.ctaCteConfig.plazoDias` | number | **EntidadesListado**: alerta plazoVencido<br>**AdminCtaCtePage**: alerta<br>**DetalleCtaCtePage**: alerta + edición |
| `movimiento.formaPago === "Cta Corriente"` | string | **movimientoService.save()**: calcula saldoCtaCte, actualiza saldo entidad |

## 5. Matriz de Permisos (modulo/formulario/accion)

| Módulo | Formulario | Acciones | Rutas protegidas | Menú |
|--------|-----------|----------|------------------|------|
| `CONFIG` | `pos` | leer, escribir, actualizar, eliminar | `/config/pos` | Config POS |
| `CONFIG` | `rubros` | leer, escribir, actualizar, eliminar | `/config/rubros` | Rubros |
| `CONFIG` | `formas-pago` | leer, escribir, actualizar, eliminar | `/config/formas-pago` | Formas de Pago |
| `CONFIG` | `sucursales` | leer, escribir, actualizar, eliminar | `/config/sucursales` | Sucursales |
| `CONFIG` | `usuarios` | leer, escribir, actualizar, eliminar | `/config/usuarios` | Usuarios |
| `POS` | `*` | * | (implícito) | POS |
| `MOVIMIENTOS` | `listado` | leer | `/movimientos` | Movimientos |
| `GESTIONES` | `caja` | * | `/admin/caja` | Admin Caja |
| `ENTIDADES` | `*` | leer | `/entidades` | Entidades |

## 6. Flujo de Datos: Login → localStorage

```
Login exitoso
  └── auth_token (localStorage)
  └── auth_user  (localStorage)
  └── initOrgConfig()
        └── org_config_<orgId>.formasPago (de organizaciones[].FormasPago)
        └── org_config_<orgId>.rubros      (defaults si no vienen)
        └── org_config_<orgId>.configPOS   (default: usaRubro: true)
  └── current_org_id     (localStorage)
  └── current_sucursal_id (localStorage, de sucursalDefault)

Switch de organización
  └── current_org_id     (actualizado)
  └── current_sucursal_id (reset a sucursalDefault)
  └── dispatch("org-changed")

Switch de sucursal
  └── current_sucursal_id (actualizado)
  └── dispatch("sucursal-changed")

Logout
  └── Limpia: auth_token, auth_user, current_org_id, current_sucursal_id
  └── Limpia: todos los org_config_<orgId>
```

## 7. Referencia cruzada localStorage ↔ objetos

| localStorage key | Objeto JSON | Archivo |
|-----------------|-------------|---------|
| `auth_token` | string | `LoginResponse.json` |
| `auth_user` | LoginResponse | `LoginResponse.json` |
| `current_org_id` | number | (simple ID) |
| `current_sucursal_id` | number | (simple ID) |
| `movimientos_db[]` | Movimiento[] | `Movimiento.json` |
| `db_clientes[]` | Cliente[] | `Cliente.json` |
| `db_proveedores[]` | Proveedor[] | `Proveedor.json` |
| `cierres_db[]` | Cierre[] | `Cierre.json` |
| `org_config_<orgId>` | ConfigOrg | `ConfigOrg.json` |
| `usuarios_db[]` | UsuarioSistema[] | `UsuarioSistema.json` |
| `sucursales_db[]` | Sucursal[] | `Sucursal.json` |
