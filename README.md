# 🚀 Guía de Integración Backend (BFF) — Frontend RedNorte

> Este documento detalla los requerimientos exactos que el **Frontend necesita del BFF** para funcionar correctamente en el entorno local (Docker).

---

## ⚠️ 1. Solución de CORS — *Urgente para poder probar*

Para que React pueda consultar el puerto `8081` sin que el navegador lo bloquee, debes habilitar CORS en el controlador web.

**Archivo a modificar:**
```
src/main/java/com/rednorte/msbff/infrastructure/adapter/in/web/BffController.java
```

**Qué hacer:** Agrega la anotación `@CrossOrigin` justo debajo de tu `@RequestMapping`.

```java
@RestController
@RequestMapping("/api/v1/bff")
@CrossOrigin(origins = "*") // <-- AGREGAR ESTO
@RequiredArgsConstructor
public class BffController { ... }
```

---

## 📦 2. DTOs Faltantes — *Crear en el Dominio*

El frontend ya tiene las pantallas listas, pero necesitamos que crees las siguientes clases para estructurar los datos.

**Ruta donde debes crearlos:**
```
src/main/java/com/rednorte/msbff/domain/model/
```

> 🔑 **Regla clave:** Usa **exactamente** estos nombres de variables (en `camelCase`) para que los componentes de React los reconozcan automáticamente.

---

### A. `AuthResponseDTO.java` — Para el Login

```java
public class AuthResponseDTO {
    private String token;
    private String rut;
    private String nombreCompleto;
    private String email;
    private String rol; // Debe ser exactamente: "ADMIN", "MEDICO" o "PACIENTE"
}
```

---

### B. `MetricasDTO.java` — Para los Dashboards

```java
public class MetricasDTO {
    private Integer totalPacientes;
    private Integer pacientesEnEspera;
    private Integer citasConfirmadas;
    private Integer citasCanceladas;
}
```

---

### C. `RegistroEsperaDTO.java` — Para cuando el médico crea una consulta

```java
public class RegistroEsperaDTO {
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private String prioridad; // "ALTA", "MEDIA" o "BAJA"
}
```

---

## 🔌 3. Nuevos Endpoints a Exponer

Necesitamos que expongas las siguientes rutas en el BFF para que el frontend pueda enviar y recibir los DTOs definidos arriba.

**Dónde crearlos:** Puedes agregarlos en `BffController.java` o crear nuevos controladores dentro de:
```
src/main/java/com/rednorte/msbff/infrastructure/adapter/in/web/
```

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/bff/auth/login` | Recibe credenciales y devuelve `AuthResponseDTO` |
| `GET` | `/api/v1/bff/metricas` | Devuelve el `MetricasDTO` calculado |
| `POST` | `/api/v1/bff/lista-espera` | Recibe un `RegistroEsperaDTO` desde el formulario del médico y lo enruta al microservicio correspondiente |

---

## 🌐 4. Variables de Entorno del Frontend

Solo como referencia, el frontend local se levanta leyendo un archivo `.env` configurado así:

```env
REACT_APP_API_BFF_URL=http://localhost:8081/api/v1/bff
```

---

## ✅ Checklist Rápido

- [ ] Agregar `@CrossOrigin(origins = "*")` en `BffController`
- [ ] Crear `AuthResponseDTO.java` en `domain/model/`
- [ ] Crear `MetricasDTO.java` en `domain/model/`
- [ ] Crear `RegistroEsperaDTO.java` en `domain/model/`
- [ ] Exponer `POST /api/v1/bff/auth/login`
- [ ] Exponer `GET /api/v1/bff/metricas`
- [ ] Exponer `POST /api/v1/bff/lista-espera`

---

*Cualquier duda, coordinamos por el canal del grupo. ¡Gracias! 🙌*
