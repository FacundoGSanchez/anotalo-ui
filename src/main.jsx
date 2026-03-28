import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DeviceProvider } from "./context/DeviceContext";
import App from "./App";
import "./index.css";

// Registro del Service Worker para la PWA
import { registerSW } from "virtual:pwa-register";

// Configura la actualización automática del Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Esto disparará un aviso nativo del navegador para recargar y aplicar cambios
    if (
      confirm(
        "Hay una nueva versión de Anotalo disponible. ¿Deseas actualizar?",
      )
    ) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Anotalo ya está lista para usarse sin conexión.");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AuthProvider>
      <DeviceProvider>
        <App />
      </DeviceProvider>
    </AuthProvider>
  </BrowserRouter>,
);
