import React, { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { notification, Button } from "antd";

const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      const key = `open${Date.now()}`;
      notification.info({
        message: "Actualización disponible",
        description:
          "Hay una nueva versión de Anotalo. ¿Deseas recargar para aplicar los cambios?",
        placement: "bottomRight",
        duration: 0,
        key,
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => updateServiceWorker(true)}
          >
            Actualizar ahora
          </Button>
        ),
        onClose: () => setNeedRefresh(false),
      });
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  return null;
};

export default UpdatePrompt;
