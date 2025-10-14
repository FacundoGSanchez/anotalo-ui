// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Input, Button, Form, Card, Typography, Avatar, Layout } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ⬅️ Importar el hook

const { Content } = Layout;
const { Title } = Typography;
const LOGO_PATH = "/images/Logo.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅️ Obtener la función de login del contexto

  const onFinish = (values) => {
    setLoading(true);
    const MOCK_USER = "admin";
    const MOCK_PASS = "ladante2025";

    setTimeout(() => {
      setLoading(false);
      if (values.username === MOCK_USER && values.password === MOCK_PASS) {
        // 1. Llamar a la función del Contexto
        login();
        // 2. Navegar a la página de inicio
        navigate("/");
      } else {
        alert("Credenciales incorrectas. Usa: admin / admin");
      }
    }, 1000);
  };

  return (
    <Layout
      style={{
        // minHeight: "100vh", (Se recomienda usarlo aquí, lo dejé comentado como lo tenías)
        backgroundColor: "#FFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content style={{ display: "flex", justifyContent: "center" }}>
        <Card
          style={{
            width: 380,
            maxWidth: "90%",
            padding: 24,
            borderRadius: 8,
            textAlign: "center",
            marginTop: "25px",
            boxShadow:
              "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
          }}
        >
          {/* ... (Contenido de Avatar y Título omitido para brevedad) ... */}
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar
              size={86}
              src={LOGO_PATH}
              style={{ backgroundColor: "#fff", border: "1px solid #ddd" }}
              icon={<UserOutlined />}
            />
          </div>

          <Title level={4} style={{ marginBottom: 32 }}>
            Iniciar Sesion
          </Title>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Por favor, introduce tu usuario!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Usuario"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce tu contraseña!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Contraseña"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Acceder
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
