# SPEC 01 — Base del Proyecto + Migración a TypeScript

## 1. Objetivo

Refactorizar la base técnica del proyecto frontend **Anótalo UI**, migrando progresivamente el código existente de JavaScript a TypeScript y estableciendo una estructura inicial que permita ejecutar posteriormente la refactorización arquitectónica del proyecto.

Esta Spec tiene como objetivo preparar el proyecto para las siguientes etapas de refactorización, manteniendo el comportamiento funcional actual.

La refactorización deberá priorizar:

- Migración a TypeScript.
- Organización inicial del código.
- Definición de convenciones.
- Configuración de aliases.
- Tipado de componentes y estructuras existentes.
- Separación inicial entre código de aplicación e infraestructura.
- Compatibilidad con la arquitectura objetivo definida para las siguientes Specs.

---

# 2. Alcance

Esta Spec incluye:

1. Migración de JavaScript a TypeScript.
2. Configuración de TypeScript.
3. Configuración de compilación.
4. Configuración de ESLint para TypeScript.
5. Configuración de aliases.
6. Definición de estructura base de `src`.
7. Tipado progresivo de componentes.
8. Tipado de Props.
9. Tipado de estados.
10. Tipado de eventos.
11. Tipado de modelos existentes.
12. Tipado de utilidades existentes.
13. Definición de convenciones de nombres.
14. Reorganización mínima necesaria para soportar la migración.

---

# 3. Fuera de alcance

Esta Spec **NO deberá implementar**:

- Nuevo cliente HTTP.
- Servicio de autenticación.
- Servicio GET.
- Servicio POST.
- Integración con API.
- Modificación del backend.
- Modificación de Stored Procedures.
- Nueva arquitectura de LocalStorage.
- Implementación de DataSource.
- Implementación de Repository.
- Refactor de lógica de negocio.
- Refactor de `useContext`.
- Creación de nuevos Hooks funcionales.
- Reutilización de componentes.
- Rediseño visual.
- Cambios de comportamiento funcional.

Estas tareas serán abordadas en Specs posteriores.

---

# 4. Estado inicial

El proyecto actual deberá ser considerado como la fuente funcional de referencia.

Antes de modificar el código se deberá realizar un inventario de la estructura actual del proyecto.

Se deberá identificar, como mínimo:

```text
src/
├── Components
├── Pages
├── Hooks
├── Context
├── Services
├── Utils
├── Storage
├── API
└── otros
```

La estructura real encontrada en el repositorio deberá documentarse antes de realizar movimientos significativos de archivos.

El objetivo es evitar que la migración a TypeScript se convierta simultáneamente en una refactorización funcional no controlada.

---

# 5. Migración a TypeScript

La migración deberá ser progresiva.

Los archivos deberán migrarse de acuerdo con su tipo:

```text
.js  → .ts
.jsx → .tsx
```

Los archivos que contengan JSX deberán utilizar:

```text
.tsx
```

Los archivos que no contengan JSX deberán utilizar:

```text
.ts
```

Ejemplo:

```text
Button.jsx
    ↓
Button.tsx

customerService.js
    ↓
customerService.ts
```

No se deberá realizar una conversión mecánica de todos los archivos sin corregir previamente los errores de tipado resultantes.

La migración deberá realizarse manteniendo el comportamiento funcional actual.

No se deberán introducir cambios funcionales como consecuencia directa de la conversión de archivos.

---

# 6. Configuración TypeScript

Se deberá configurar TypeScript para el proyecto respetando el entorno actual de React + Vite.

La configuración deberá:

- Permitir la compilación del proyecto.
- Detectar errores de tipos.
- Soportar JSX.
- Soportar módulos ES.
- Permitir aliases.
- Mantener una configuración estricta progresiva.

Se recomienda utilizar:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Si el proyecto existente contiene una cantidad significativa de código sin tipado, la migración podrá realizarse progresivamente, pero el objetivo final será mantener el modo estricto habilitado.

No se deberá desactivar el chequeo de tipos globalmente para ocultar errores de migración.

No se deberá utilizar una configuración que permita compilar silenciosamente código incorrectamente tipado.

---

# 7. Uso de `any`

Durante la migración se deberá evitar el uso indiscriminado de:

```ts
any
```

No se deberá utilizar `any` como solución general para resolver errores de TypeScript.

Cuando no sea posible definir el tipo inmediatamente, se deberá priorizar:

```ts
unknown
```

o crear un tipo temporal explícito.

Ejemplo:

```ts
const response: unknown = getResponse();
```

El uso de `any` deberá quedar limitado a casos excepcionales y justificados.

No se deberá utilizar:

```ts
any
```

como mecanismo general para acelerar la migración.

Los casos excepcionales de uso de `any` deberán quedar identificados para su posterior revisión.

---

# 8. Tipado de componentes

Todos los componentes migrados a TypeScript deberán tener Props explícitamente tipadas.

Ejemplo:

```tsx
interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  label,
  disabled = false,
  onClick
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

No se deberá utilizar:

```tsx
function Button(props: any)
```

como solución general.

Las Props deberán representar únicamente la información necesaria para que el componente cumpla su responsabilidad actual.

No se deberá modificar la API funcional de los componentes salvo que sea necesario para completar la migración a TypeScript.

---

# 9. Tipado de eventos

Los eventos de React deberán estar correctamente tipados.

Ejemplo:

```tsx
const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  // ...
};
```

Para formularios:

```tsx
const handleSubmit = (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
};
```

El tipo deberá corresponder al elemento real que genera el evento.

Se deberán tipar correctamente, cuando corresponda:

- `ChangeEvent`.
- `FormEvent`.
- `MouseEvent`.
- `KeyboardEvent`.
- `FocusEvent`.
- Otros eventos específicos de React.

---

# 10. Tipado de estado

Los estados creados mediante `useState` deberán tener tipos explícitos cuando TypeScript no pueda inferirlos correctamente.

Ejemplo:

```tsx
const [loading, setLoading] = useState<boolean>(false);
```

Para objetos:

```tsx
const [customer, setCustomer] =
  useState<Customer | null>(null);
```

Para colecciones:

```tsx
const [customers, setCustomers] =
  useState<Customer[]>([]);
```

Se deberá evitar el uso de estados genéricos:

```tsx
useState<any>()
```

Cuando el estado pueda ser inferido correctamente por TypeScript, no será necesario especificar el tipo manualmente.

---

# 11. Tipado de modelos

Se deberán identificar los modelos principales actualmente utilizados por la aplicación.

Como mínimo se deberá analizar:

```text
Clientes
Productos
Ventas
Movimientos
Proveedores
Usuarios
```

La lista definitiva deberá surgir del análisis del código existente.

Se deberán crear tipos o interfaces para representar las estructuras actualmente utilizadas.

Ejemplo:

```ts
export interface Customer {
  id: string;
  name: string;
  phone?: string;
}
```

Estos modelos deberán representar el estado actual de la aplicación.

**No se deberán rediseñar los modelos en esta Spec.**

La adaptación a DTOs específicos de API será responsabilidad de una Spec posterior.

---

# 12. Tipos compartidos

Los tipos utilizados por múltiples funcionalidades deberán centralizarse.

Estructura inicial propuesta:

```text
src/
└── types/
    ├── common.ts
    ├── customer.ts
    ├── product.ts
    ├── sale.ts
    └── movement.ts
```

La estructura definitiva deberá ajustarse a las entidades reales encontradas en el proyecto.

No se deberá crear un archivo global con cientos de interfaces no relacionadas.

Los tipos deberán mantenerse agrupados por contexto funcional.

Cuando un tipo sea exclusivo de una funcionalidad, deberá evaluarse si corresponde mantenerlo junto con dicha funcionalidad en lugar de ubicarlo en `types` global.

---

# 13. Alias de imports

Se deberán configurar aliases para evitar imports relativos excesivamente largos.

Ejemplo:

```ts
import { Button } from '@/components/ui/Button';
```

en lugar de:

```ts
import { Button } from '../../../../components/ui/Button';
```

Se recomienda utilizar:

```text
@
```

como alias raíz de `src`.

Ejemplo:

```text
@ → src
```

La configuración deberá estar sincronizada entre:

- TypeScript.
- Vite.
- ESLint, si corresponde.
- IDE.

El alias deberá utilizarse de forma consistente una vez establecido.

No se deberán combinar indiscriminadamente imports relativos y aliases para acceder a las mismas rutas sin una razón justificada.

---

# 14. Estructura base

Como resultado de esta Spec se deberá establecer una estructura inicial similar a:

```text
src/
├── app/
│   ├── App.tsx
│   └── routes/
│
├── components/
│
├── pages/
│
├── hooks/
│
├── contexts/
│
├── services/
│
├── api/
│
├── storage/
│
├── types/
│
├── models/
│
├── config/
│
├── utils/
│
├── constants/
│
└── assets/
```

Esta estructura representa la **arquitectura base prevista**, pero no implica que en esta Spec deban implementarse todas las capas.

Por ejemplo:

```text
api/
```

podrá existir como punto de extensión para la:

> SPEC 02 — Infraestructura API Auth / GET / POST

pero no deberá implementarse en esta etapa.

Lo mismo aplica a:

```text
services/
storage/
```

La creación de carpetas no implica implementar todavía la arquitectura definitiva.

La estructura podrá ajustarse durante la ejecución si el análisis del código existente demuestra que una organización diferente resulta más adecuada.

---

# 15. Organización por Feature

En esta primera Spec no se deberá realizar una reorganización completa de todas las funcionalidades.

La organización por Feature será evaluada durante las Specs posteriores.

La migración deberá priorizar:

```text
TypeScript
+
Tipado
+
Estructura base
```

No se deberá realizar simultáneamente:

```text
TypeScript
+
Feature Architecture
+
Services
+
DataSource
+
Hooks
+
Components
```

Esto permitirá que cada cambio arquitectónico pueda validarse de forma independiente.

La organización definitiva por funcionalidad se definirá durante la etapa de refactorización correspondiente.

---

# 16. Convenciones de nombres

Se deberán establecer las siguientes convenciones.

## 16.1 Componentes

Utilizar `PascalCase`.

Ejemplo:

```text
CustomerForm.tsx
CustomerList.tsx
MainLayout.tsx
```

---

## 16.2 Hooks

Utilizar:

```text
use + PascalCase
```

Ejemplo:

```text
useCustomers.ts
useAuth.ts
```

---

## 16.3 Services

Utilizar:

```text
camelCase + Service
```

Ejemplo:

```text
customerService.ts
productService.ts
```

---

## 16.4 Types

Utilizar `camelCase`.

Ejemplo:

```text
customer.ts
product.ts
```

---

## 16.5 Constants

Utilizar:

```text
UPPER_SNAKE_CASE
```

Ejemplo:

```ts
MAX_ITEMS
API_TIMEOUT
```

Las convenciones deberán mantenerse consistentes durante las siguientes Specs.

---

# 17. Componentes existentes

Durante la migración se deberán conservar los componentes existentes y su comportamiento actual.

No se deberá aprovechar la migración para crear componentes genéricos nuevos salvo que sea estrictamente necesario para resolver la migración.

Por ejemplo, si existen:

```text
ButtonA
ButtonB
ButtonC
```

no se deberá crear automáticamente:

```text
UniversalButton
```

en esta Spec.

La revisión de reutilización, duplicación y consolidación de componentes corresponde a:

> SPEC 06 — Refactorización y Reutilización de Componentes.

---

# 18. Context existentes

Los `Context` existentes deberán mantenerse funcionalmente sin realizar una refactorización arquitectónica profunda.

Durante la migración deberán:

- Ser convertidos a TypeScript.
- Tipar sus valores.
- Tipar sus Providers.
- Tipar sus Hooks consumidores.
- Tipar correctamente sus valores iniciales.

Ejemplo:

```tsx
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}
```

La decisión de:

```text
Mantener Context
```

o:

```text
Migrar lógica a Hook
```

será parte de:

> SPEC 05 — Refactorización de Hooks y Context.

En esta Spec no se deberá eliminar un Context existente únicamente por consideraciones arquitectónicas.

---

# 19. Services existentes

Los Services actuales deberán migrarse a TypeScript respetando su comportamiento actual.

No se deberá modificar su arquitectura en esta etapa.

La separación entre:

```text
Service
    ↓
DataSource
    ↓
API / LocalStorage
```

será realizada en las Specs correspondientes.

Los Services existentes podrán continuar utilizando temporalmente las implementaciones actuales de acceso a datos mientras se completa la migración.

No se deberá introducir en esta etapa la abstracción definitiva entre API y LocalStorage.

---

# 20. Persistencia existente

El acceso actual a `localStorage` deberá mantenerse funcionando.

No se deberá implementar todavía una nueva capa de abstracción para separar:

```text
LocalStorage
```

de:

```text
API
```

La reorganización de persistencia se realizará en:

> SPEC 03 — Abstracción de Persistencia LocalStorage ↔ API.

Durante esta Spec únicamente se deberá tipar el código existente cuando corresponda.

Ejemplo:

```ts
const storedData: unknown = localStorage.getItem('key');
```

La lógica definitiva de serialización, deserialización, claves y manejo de almacenamiento será definida posteriormente.

---

# 21. API existente

La integración actual con el backend deberá mantenerse sin modificaciones funcionales.

No se deberá crear todavía la nueva arquitectura:

```text
Auth
GET
POST
```

Esta separación será responsabilidad de:

> SPEC 02 — Infraestructura de Comunicación API Auth / GET / POST.

Durante esta Spec, las llamadas existentes deberán ser migradas a TypeScript únicamente en la medida necesaria para mantener la compilación y el funcionamiento actual.

No se deberá modificar:

- Endpoints.
- Procesos.
- Parámetros.
- Formato de requests.
- Formato de responses.
- Contratos del backend.

---

# 22. Compatibilidad funcional

La migración deberá conservar el comportamiento actual de la aplicación.

No deberán modificarse intencionalmente:

- Flujos funcionales.
- Reglas de negocio.
- Procesos.
- Validaciones funcionales.
- Persistencia.
- Integración con el backend.
- Contratos actuales de API.
- Comportamiento visual.

Cualquier modificación funcional detectada durante la migración deberá considerarse fuera del alcance de esta Spec.

Si durante la migración se detecta un error funcional existente, deberá documentarse para su tratamiento posterior y no corregirse como parte de esta Spec, salvo que impida la compilación o ejecución del proyecto.

---

# 23. Validación de la migración

Antes de considerar finalizada la Spec se deberá verificar:

## 23.1 Compilación

Ejecutar:

```bash
npm run build
```

o el comando equivalente definido por el proyecto.

El proyecto deberá compilar sin errores TypeScript.

---

## 23.2 Ejecución en desarrollo

Ejecutar:

```bash
npm run dev
```

o el comando equivalente definido por el proyecto.

La aplicación deberá iniciar correctamente.

---

## 23.3 Lint

Ejecutar:

```bash
npm run lint
```

o el comando equivalente definido por el proyecto.

El proyecto deberá cumplir las reglas configuradas.

Si existen warnings, deberán evaluarse individualmente.

No se deberán ocultar warnings o errores globalmente como mecanismo para finalizar la migración.

---

## 23.4 Verificación funcional

Se deberá comprobar que las funcionalidades actuales continúan funcionando.

Como mínimo se deberá verificar:

- Inicio de la aplicación.
- Navegación.
- Login, si corresponde.
- Persistencia existente.
- Lectura de datos.
- Escritura de datos.
- Funcionalidades principales disponibles.

La validación deberá confirmar que la migración a TypeScript no modificó el comportamiento funcional.

---

# 24. Criterios de aceptación

La SPEC se considerará finalizada cuando se cumplan los siguientes criterios.

## 24.1 TypeScript

- [ ] El proyecto compila correctamente con TypeScript.
- [ ] Los componentes migrados utilizan `.tsx`.
- [ ] La lógica sin JSX utiliza `.ts`.
- [ ] Los Props están tipados.
- [ ] Los estados relevantes están tipados.
- [ ] Los eventos están tipados.
- [ ] Los modelos principales están tipados.
- [ ] Los Context existentes están tipados.
- [ ] Los Hooks existentes están tipados.
- [ ] Los Services existentes están tipados.
- [ ] Las utilidades existentes relevantes están tipadas.

---

## 24.2 Calidad

- [ ] No existen errores TypeScript de compilación.
- [ ] No se utiliza `any` de forma indiscriminada.
- [ ] No se deshabilita globalmente el tipado estricto para ocultar errores.
- [ ] ESLint funciona correctamente.
- [ ] El build de producción funciona correctamente.
- [ ] La aplicación continúa funcionando con el comportamiento existente.

---

## 24.3 Arquitectura

- [ ] Existe una estructura base de carpetas definida.
- [ ] Existe un alias raíz para `src`.
- [ ] Las convenciones de nombres están definidas.
- [ ] La estructura permite implementar la SPEC de API.
- [ ] La estructura permite implementar la abstracción LocalStorage/API.
- [ ] No se modifica el comportamiento funcional existente.
- [ ] No se implementa todavía la nueva arquitectura de Services/DataSource.
- [ ] No se implementa todavía la nueva arquitectura API Auth/GET/POST.
- [ ] No se realiza todavía una refactorización general de Context.
- [ ] No se realiza todavía una consolidación general de componentes.

---

# 25. Resultado esperado

Al finalizar esta Spec, el proyecto deberá encontrarse en el siguiente estado:

```text
┌────────────────────────────────────┐
│          ANÓTALO UI                │
│                                    │
│     React + Vite + TypeScript      │
│                                    │
│  Código actual funcional           │
│  migrado y correctamente tipado    │
│                                    │
│  Estructura base preparada         │
│          para refactor             │
└────────────────────────────────────┘
                 │
                 ▼
        SPEC 02 — API
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
       AUTH     GET      POST
                 │
                 ▼
        SPEC 03 — DataSource
                 │
          ┌──────┴──────┐
          ▼             ▼
       LOCAL           API
```

El proyecto deberá continuar funcionando igual que antes de la refactorización, pero contará con:

- TypeScript configurado.
- Código migrado progresivamente.
- Tipado de componentes.
- Tipado de Hooks.
- Tipado de Context.
- Tipado de Services.
- Tipado de modelos.
- Tipado de utilidades relevantes.
- Alias de imports.
- Estructura base preparada.
- Convenciones definidas.

---

# 26. Arquitectura objetivo de la refactorización

Esta Spec no implementará la arquitectura completa, pero deberá dejar el proyecto preparado para alcanzar progresivamente la siguiente arquitectura:

```text
Component
    │
    ▼
Page
    │
    ▼
Hook
    │
    ▼
Service
    │
    ▼
DataSource
    │
    ├───────────────┐
    ▼               ▼
LocalStorage       API
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        Auth       GET       POST
                    │         │
                    ▼         ▼
                 Proceso    Proceso
                    │         │
                    ▼         ▼
                    SP        SP
```

La arquitectura deberá implementarse progresivamente mediante las siguientes Specs.

---

# 27. Orden de ejecución posterior

Una vez finalizada esta Spec, la evolución prevista será:

```text
SPEC 01
Base del Proyecto + TypeScript
        │
        ▼
SPEC 02
Infraestructura de Comunicación
Auth + GET + POST
        │
        ▼
SPEC 03
Abstracción de Persistencia
LocalStorage ↔ API
        │
        ▼
SPEC 04
Services y lógica de negocio
        │
        ▼
SPEC 05
Hooks y revisión de Context
        │
        ▼
SPEC 06
Componentes reutilizables
        │
        ▼
SPEC 07
Refactorización progresiva
por funcionalidad
```

---

# 28. Principio rector

La migración a TypeScript **no debe convertirse en una refactorización funcional general del proyecto**.

Esta Spec debe preparar la base técnica para las siguientes etapas.

El objetivo es obtener un proyecto:

```text
React
+
Vite
+
TypeScript
+
Código actual funcional
+
Tipado
+
Estructura base
```

sobre el cual posteriormente se pueda implementar la arquitectura definitiva.

La arquitectura objetivo a alcanzar progresivamente será:

```text
Component
    │
    ▼
Page
    │
    ▼
Hook
    │
    ▼
Service
    │
    ▼
DataSource
    │
    ├───────────────┐
    ▼               ▼
LocalStorage       API
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        Auth       GET       POST
                    │         │
                    ▼         ▼
                 Proceso    Proceso
                    │         │
                    ▼         ▼
                    SP        SP
```

Esta arquitectura será implementada progresivamente mediante las Specs posteriores y no deberá ser implementada completamente dentro de la presente Spec.
