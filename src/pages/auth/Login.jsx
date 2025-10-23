import React, { useState } from "react";
import { Input, Button, Form, Typography, Layout } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginStyles.css";
import AnotaloLogo from "./Logo";

const { Title, Link } = Typography;
const { Footer, Content } = Layout;

const MOCK_USER = "admin";
const MOCK_PASS = "ladante2025";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.username === MOCK_USER && values.password === MOCK_PASS) {
        login();
        navigate("/");
      } else {
        alert("Credenciales incorrectas. Usa: admin / ladante2025");
      }
    }, 1000);
  };

  return (
    <Layout className="anotalo-login-screen">
      {/* 1. Logo */}

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
            username: MOCK_USER, // Asigna el valor mock al campo 'username'
            password: MOCK_PASS, // Asigna el valor mock al campo 'password'
          }}
        >
          {/* Campo Usuario */}
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

          {/* Campo Contraseña */}
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

          {/* Enlace de Olvidaste Contraseña */}
          <div className="anotalo-forgot-password-container">
            <Link href="#" className="anotalo-forgot-password-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón Ingresar */}
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

      {/* 3. Sección inferior de Crear Cuenta */}
      <Footer className="anotalo-create-account-footer">
        <Button type="link" className="anotalo-create-account-button">
          Crear Cuenta
        </Button>
      </Footer>
    </Layout>
  );
};

export default Login;
