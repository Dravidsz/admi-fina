# Subplan: Despliegue

## Objetivo
Poner el sistema en producción de forma segura y escalable.

## Infraestructura recomendada

| Servicio | Opción |
|----------|--------|
| Aplicación | Vercel, Railway o Render |
| Base de datos | MongoDB Atlas |
| Autenticación | Clerk |
| Almacenamiento de reportes | AWS S3 o Cloudflare R2 (opcional) |

## Variables de entorno

```bash
MONGODB_URI=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
SESSION_SECRET=            # Si se usa sesiones propias
NODE_ENV=production
```

## Pasos de despliegue

1. Configurar MongoDB Atlas y obtener URI.
2. Configurar proyecto en Vercel/Railway/Render.
3. Agregar variables de entorno.
4. Configurar dominios en Clerk.
5. Desplegar.
6. Verificar conexión a base de datos.

## Consideraciones

- El backend de Express requiere Node.js 18+.
- Configurar CORS si el frontend y backend están separados.
- Habilitar backups automáticos en MongoDB Atlas.
