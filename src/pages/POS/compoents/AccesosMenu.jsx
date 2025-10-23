import { Button } from "antd";
import {
  ShoppingCartOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

const AccesosMenu = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px", // Reducido el gap para un espacio más estrecho
        justifyContent: "flex-end", // ⬅️ CAMBIO CLAVE: Alinea los botones a la derecha
        paddingTop: "10px",
      }}
    >
           {" "}
      <Button
        type="default"
        icon={<ShoppingCartOutlined />}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 10px", // Ajustado el padding para el espacio reducido
          height: "auto",
          borderColor: "transparent",
        }}
      ></Button>
           {" "}
      <Button
        type="default"
        icon={<QuestionCircleOutlined />}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 10px",
          height: "auto",
          borderColor: "transparent",
        }}
      ></Button>
           {" "}
      <Button
        type="default"
        icon={<EditOutlined />}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 10px",
          height: "auto",
          borderColor: "transparent",
        }}
      ></Button>
         {" "}
    </div>
  );
};

export default AccesosMenu;
