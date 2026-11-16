# Subplan: Autenticación y Autorización

## Objetivo
Proteger el acceso al sistema y asociar empresas a usuarios.

## Opciones recomendadas

### Opción A: Clerk (recomendada para TanStack)
- Fácil integración con React.
- Gestión de usuarios, roles y sesiones.

### Opción B: Auth.js (NextAuth)
- Más flexible pero requiere más configuración.

## Modelo de datos

```typescript
interface Usuario {
  _id: ObjectId;
  clerkId?: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'usuario';
  createdAt: Date;
}
```

## API / Server functions

- `getUsuarioActual()` — Retorna el usuario de la sesión.
- `esAdmin()` — Verifica si el usuario es administrador.

## Componentes UI

- `LoginButton` — Botón de inicio de sesión.
- `UserProfile` — Perfil de usuario.
- `ProtectedRoute` — Wrapper para rutas protegidas.

## Relación con otras funcionalidades

- Cada empresa puede pertenecer a un usuario.
- Los usuarios solo ven sus propias empresas (a menos que sean admin).
