// App.jsx
import AppRouter from "./router/AppRouter";
import UpdatePrompt from "./components/UpdatePrompt"; // El componente que usa antd

function App() {
  return (
    <>
      {/* UpdatePrompt no renderiza nada visual, 
          solo dispara la notificación cuando detecta el cambio */}
      <UpdatePrompt />
      <AppRouter />
    </>
  );
}

export default App;
