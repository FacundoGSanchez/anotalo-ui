import { useState } from "react";
import { Input, Button, Form, Typography, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/utils/crypto";
import "./components/style.css";
import AnotaloLogo from "./components/Logo";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(values.password);
      await login(values.username, hashedPassword);
      navigate("/");
    } catch (err) {
      message.error((err instanceof Error ? err.message : null) || "No se pudo iniciar sesión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anotalo-login-wrapper">
      <div className="anotalo-login-content">
        <AnotaloLogo width={"120px"} />
        <Title level={3} className="anotalo-login-header">
          INICIAR SESION
        </Title>

        <Form
          name="login_form"
          onFinish={onFinish}
          className="antd-login-form"
          initialValues={{
            username: "admin",
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "¡Ingresa tu usuario!" }]}
          >
            <Input
              placeholder="Usuario"
              className="anotalo-input"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "¡Ingresa tu contraseña!" }]}
          >
            <Input.Password
              placeholder="Contraseña"
              className="anotalo-input"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="anotalo-login-button"
              loading={loading}
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
