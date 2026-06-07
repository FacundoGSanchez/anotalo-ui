import React, { useState } from "react";
import { Input, Button, Form, Typography, Layout, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./components/style.css";
import AnotaloLogo from "./components/Logo";

const { Title, Link } = Typography;
const { Footer, Content } = Layout;

const MOCK_USER = "admin";
const MOCK_PASS = "adminanotalo";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch (err) {
      message.error(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="anotalo-login-screen">
      {/* 2. Formulario y Contenido */}
      <Content className="anotalo-login-content">
        <AnotaloLogo width={"120px"} />
        <Title level={3} className="anotalo-login-header">
          INICIAR SESION
        </Title>

        <Form
          name="login_form"
          onFinish={onFinish}
          className="antd-login-form"
          initialValues={{
            username: MOCK_USER,
            password: MOCK_PASS,
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

          <div className="anotalo-forgot-password-container">
            <Link href="#" className="anotalo-forgot-password-link" disabled>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

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
      </Content>

      <Footer className="anotalo-create-account-footer">
        <Button type="link" className="anotalo-create-account-button" disabled>
          Crear Cuenta
        </Button>
      </Footer>
    </Layout>
  );
};

export default Login;
