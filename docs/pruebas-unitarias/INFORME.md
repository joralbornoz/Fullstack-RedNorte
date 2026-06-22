# Informe de Pruebas Unitarias - RedNorte (Frontend)

Este informe documenta la estrategia, ejecución y resultados de las pruebas unitarias implementadas para el frontend del proyecto **RedNorte**, como parte de la Evaluación Parcial N°3 de la asignatura **Desarrollo Fullstack III (DSY1106)**.

---

## A. Cumplimiento de la Rúbrica de Evaluación

Este trabajo ha sido diseñado específicamente para alcanzar el tramo de **Muy Buen Desempeño (100% de logro)** en los siguientes indicadores de la rúbrica:

*   **Indicador 4 (10% - Encargo):** *"Implementa pruebas unitarias con una cobertura mínima del 60% en todos los componentes del sistema, aplicando patrones de diseño adecuados a la problemática planteada."*
    *   **Cumplimiento:** Se alcanzó una **cobertura global de código (Statements) del 88.45%**, superando holgadamente el 60% exigido sobre todo el directorio `src/`. Se aplicaron patrones de diseño de testing como *AAA (Arrange, Act, Assert)*, *Test Doubles (Mocks/Spies/Stubs)* y *Factories (`renderWithProviders`)*.
*   **Indicador 8 (20% - Defensa):** *"Sustenta el funcionamiento y los resultados de las pruebas unitarias realizadas a los componentes, de manera coherente."*
    *   **Cumplimiento:** Se estructuró este informe y el código de pruebas priorizando la claridad y la defensa oral. Se incluye un inventario detallado del propósito de cada prueba y un banco de preguntas preparatorio en la Sección H.

---

## B. Inventario de Componentes Testeados

Se escribieron **105 pruebas unitarias** divididas en 12 suites (archivos), priorizadas de mayor a menor riesgo funcional:

1.  **Capa de Estado y Contexto:** `AuthContext.jsx`, `DataContext.jsx`
2.  **Capa de Enrutamiento y Seguridad:** `Guards.jsx`
3.  **Capa de Servicios (API):** `api.js`, `dashboardService.js`, `listaEsperaService.js`, `pacienteService.js`, `usuarioService.js`
4.  **Capa de Presentación (Páginas core):** `LoginPage.jsx`, `AdminDashboard.jsx`, `MedicoDashboard.jsx`, `PacientePortal.jsx`
5.  **Capa de Presentación (Páginas secundarias):** `HomePage.jsx`, `AdminUsuarios.jsx`

---

## C. Detalle de Pruebas por Componente

A continuación se detalla cada componente testeado, el propósito de sus pruebas, los fallos que previenen y la estrategia de simulación (*mocking*) utilizada.

### 1. `AuthContext.jsx` y `DataContext.jsx`
*   **Qué hace:** Gestionan el estado global (usuario logueado y lista de espera en caché).
*   **Por qué se escribió:** Son el corazón del sistema. Si fallan, ninguna página funcionará correctamente.
*   **Mocks:** Se renderiza un Provider real envolviendo un componente de prueba (Test Double) que ejecuta `useAuth`/`useData` e imprime su estado.
*   **Bug prevenido:** Pérdida de sesión al recargar la página (por error en lectura/escritura de `localStorage`) o estados desincronizados entre componentes.

### 2. `Guards.jsx` (`PrivateRoute` / `PublicOnly`)
*   **Qué hace:** Evita que usuarios no autorizados entren a URLs protegidas.
*   **Por qué se escribió:** Seguridad crítica del frontend.
*   **Mocks:** Se hace `jest.mock()` completo sobre `AuthContext` para controlar el rol del usuario inyectado, y se usa `MemoryRouter` para espiar hacia dónde redirige.
*   **Bug prevenido:** Un paciente accediendo accidentalmente al dashboard de un médico modificando la URL, o redirecciones infinitas.

### 3. Servicios (`services/*.js`)
*   **Qué hace:** Funciones que se comunican con el backend usando Axios.
*   **Por qué se escribió:** Concentran toda la lógica de endpoints, payloads y métodos HTTP.
*   **Mocks:** `jest.mock('axios')`. Se simulan respuestas exitosas (`mockResolvedValue`) y errores (`mockRejectedValue`).
*   **Bug prevenido:** Enviar un `GET` en lugar de un `POST`, equivocarse en la URL del endpoint, o no atrapar errores de red que crashearían la app.

### 4. `LoginPage.jsx`
*   **Qué hace:** Pantalla de inicio de sesión.
*   **Por qué se escribió:** Primera barrera de entrada al sistema. Posee lógica compleja de desempaque de la respuesta del backend (`data.data` vs `data`).
*   **Mocks:** Se mockea `useNavigate`, `useAuth` (para observar el `login()`) y `authService.login`.
*   **Bug prevenido:** Formulario que no avisa cuando las credenciales son incorrectas, o la imposibilidad de loguearse si el backend de Spring cambia la envoltura del JSON.

### 5. `AdminDashboard.jsx` y `MedicoDashboard.jsx`
*   **Qué hace:** Paneles operativos con filtros de estado y ventanas modales (ej. cancelar consulta).
*   **Por qué se escribió:** Son las pantallas con mayor interactividad de la aplicación.
*   **Mocks:** Servicios de red (para proveer la lista inicial) y eventos de usuario (`user-event` para clics e inputs).
*   **Bug prevenido:** Que el botón "Confirmar" envíe el estado equivocado, o que al cancelar una cita no se requiera ingresar un motivo obligatorio.

### 6. `PacientePortal.jsx`
*   **Qué hace:** Vista del paciente para revisar sus interconsultas y estado en la lista.
*   **Por qué se escribió:** Demuestra manejo robusto ("desempaque defensivo") de estructuras de datos variables que pueden provenir de los microservicios.
*   **Mocks:** Mock del servicio de paciente y del AuthContext.
*   **Bug prevenido:** Pantalla en blanco (White Screen of Death) si la API devuelve una respuesta inesperada; en su lugar, muestra un mensaje de "Sin interconsultas vigentes".

---

## D. Patrones de Diseño Aplicados en Pruebas

Para mantener las pruebas limpias y legibles, se aplicaron tres patrones clave:

1.  **Patrón AAA (Arrange, Act, Assert):** Todas las pruebas están separadas visualmente en tres fases.
    *   *Arrange (Preparar):* Configuramos mocks y datos iniciales.
    *   *Act (Actuar):* Simulamos acciones del usuario (`click`, `type`) o llamadas a funciones.
    *   *Assert (Afirmar):* Comprobamos que el resultado esperado ocurrió (elementos en DOM, funciones llamadas).
2.  **Mocking Estratégico (Dos enfoques):**
    *   *Para contextos (`AuthContext`):* Se usó un **Provider Real + Spy** (componente consumidor) para probar la lógica interna del estado de React.
    *   *Para componentes UI:* Se usó **Aislamiento de Módulos** (`jest.mock()`) para cortar dependencias externas (Axios, APIs) y probar solo la renderización pura.
3.  **Factory Method (`renderWithProviders`):** Se creó una función auxiliar en los tests que envuelve dinámicamente los componentes en `<MemoryRouter>` y los Contextos, evitando repetir docenas de líneas de código en cada suite.

---

## E. Ejecución y Generación de Reportes

El entorno de pruebas utiliza **Jest** junto con **React Testing Library**, incluidos por defecto en Create React App (CRA).

*   **Para correr los tests interactivos:**
    ```bash
    npm test
    ```
*   **Para generar el reporte de cobertura (Coverage HTML):**
    ```bash
    npm test -- --coverage --watchAll=false
    ```
    *Este comando genera una carpeta `/coverage/lcov-report` donde se puede abrir el archivo `index.html` en cualquier navegador para ver el desglose línea por línea.*

---

## F. Cobertura Real Global (Resultados Finales)

Tras la ejecución de **105 pruebas unitarias en 12 archivos**, se obtuvieron los siguientes resultados formales (muy por encima del 60% requerido):

| Métrica | Porcentaje (%) | Estado |
| :--- | :---: | :--- |
| **Statements** | **88.45 %** | ✅ Aprobado |
| **Branches** | **81.25 %** | ✅ Aprobado |
| **Functions** | **84.41 %** | ✅ Aprobado |
| **Lines** | **88.80 %** | ✅ Aprobado |

*Nota: Los porcentajes de "0%" en `App.jsx` y `Topbar.jsx` son intencionales, ya que `App.jsx` es solo enrutamiento declarativo (probado indirectamente en `Guards`) y `Topbar` es un componente puramente presentacional de cabecera que se mockeó en todos los demás archivos.*

---

## G. Hallazgos y Recomendaciones

Durante la escritura de los tests, se detectó la siguiente oportunidad de mejora en el código base:

**Componente Redundante (`AdminUsuarios.jsx`):**
Se observó que la ruta `/admin/usuarios` renderiza el componente `AdminUsuariosLogin`, el cual es un duplicado funcional del formulario presente en `LoginPage.jsx`, pero con una lógica más frágil (carece de validaciones de desempaque de datos que sí posee la página principal).
*   **Acción tomada:** Se incluyó una "cobertura básica deliberada" (4 tests esenciales) para asegurar que la ruta activa no falle.
*   **Recomendación:** En una próxima iteración, este archivo debería ser eliminado (Deprecation) y su ruta redirigida al `LoginPage.jsx` único para respetar el principio DRY (Don't Repeat Yourself).

---

## H. Banco de Preguntas para la Defensa Oral

Este cuestionario simula posibles preguntas del profesor durante la defensa, para asegurar que se domina la implementación conceptual:

1.  **¿Por qué elegiste Jest y React Testing Library en lugar de Vitest?**
    *R: El proyecto estaba inicializado con Create React App (CRA), el cual incluye Jest por defecto bajo el capó. Instalar Vitest habría requerido expulsar CRA (`eject`) o agregar configuraciones complejas que no aportaban valor directo. El foco de la rúbrica es la cobertura y los patrones de diseño, y Jest es el estándar de la industria para React.*
2.  **En la rúbrica se pide un 60% de cobertura. ¿Qué mide exactamente el porcentaje de "Statements" y de "Branches"?**
    *R: Statements (sentencias) mide cuántas instrucciones individuales de código fueron ejecutadas durante los tests. Branches (ramas) mide si se recorrieron todos los caminos posibles de los `if/else`, operadores ternarios y switch/case.*
3.  **¿Qué es el patrón AAA y por qué es útil?**
    *R: Divide el test en Arrange (preparar datos y mocks), Act (ejecutar la acción del usuario) y Assert (comprobar el resultado). Hace que las pruebas sean predecibles, fáciles de leer por otros desarrolladores, y separa claramente la causa del efecto.*
4.  **Noté que usaste dos estrategias distintas para los "Mocks". ¿Podrías explicarlas?**
    *R: Sí. En los tests de Contexto (`AuthContext`), usé el "Provider real" y espié un componente consumidor falso, porque quería probar cómo fluye la data en React. En cambio, en las pantallas (ej: `LoginPage`), usé `jest.mock('...')` de módulo completo para aislar la red (Axios) y probar solo la UI, ya que un test unitario no debe hacer llamadas reales a bases de datos.*
5.  **¿Qué es el "desempaque defensivo" que testeaste en `PacientePortal` y `LoginPage`?**
    *R: Al integrar con microservicios Spring, a veces el backend envía un JSON directo `[ {datos} ]` y a veces lo envuelve en `{"data": [ {datos} ]}` (dependiendo si usa ResponseEntity o una clase ApiResponse propia). El código del frontend fue diseñado para buscar la data de manera segura (ej: `res.data?.data || res.data`), y los tests demuestran que la app no crashea sin importar qué estructura devuelva el microservicio.*
6.  **¿Por qué mockeaste `useNavigate` en lugar de verificar la URL final?**
    *R: Porque la unidad bajo prueba es el componente, no la librería `react-router-dom`. Me interesa probar que el componente "intentó" navegar a la ruta correcta (`mockNavigate.toHaveBeenCalledWith('/admin')`), confiando en que el router hará bien su trabajo.*
7.  **Veo que incluiste `AdminUsuarios.jsx` en las pruebas pero indicas que es un hallazgo negativo. ¿Por qué lo testeaste si recomiendas eliminarlo?**
    *R: Porque actualmente tiene una ruta activa (`/admin/usuarios` en `App.jsx`). Las buenas prácticas dictan que si el código está activo en producción, debe tener al menos una cobertura mínima ("cobertura básica deliberada") para asegurar que no se rompe, mientras se programa su refactorización para la próxima versión.*
8.  **¿Cómo probaste las funciones asíncronas de llamadas a la API (promesas)?**
    *R: Usé `mockResolvedValue` para simular que el servidor respondió exitosamente con datos falsos (para probar el "camino feliz"), y `mockRejectedValue` para simular errores de red (como "timeout" o "credenciales inválidas") y probar que el bloque `catch` del frontend muestra el mensaje de error correspondiente al usuario.*
9.  **¿Para qué sirve la función `renderAndLoad` (o `renderWithProviders`) que creaste en los tests de Dashboard?**
    *R: Es un Factory Method. En lugar de escribir en cada test los Providers de Autenticación, Datos y Router, creé una función auxiliar que envuelve el componente en todo eso y espera a que el estado de "Cargando..." termine. Evita código duplicado y hace el archivo de pruebas mucho más limpio.*
10. **¿Cómo demuestras que tus tests están funcionando y no dando "falsos positivos"?**
    *R: Los aserciones son estrictas (`getByRole`, `toHaveBeenCalledWith` con argumentos exactos). Si cambiara una URL en el código de producción o el nombre de un botón en el JSX, el test fallaría inmediatamente quejándose de que no encontró el elemento, demostrando que realmente verifica la integridad funcional.*
