// spec_layout.jsx
// Especificación del layout según dispositivo (desktop vs mobile)
// Usa useDevice() → { isMobile, isDesktop }

export const LAYOUT_SPEC = {
  desktop: {
    sidebar: {
      type: "Sider",
      width: 220,
      theme: "dark",
      fixed: true, // no colapsable, siempre visible
      logo: { src: "/images/Logo.png", alt: "Logo Anótalo", title: "Anótalo" },
      menu: {
        mode: "inline",
        items: [
          { label: "Inicio", icon: "HomeOutlined", route: "/" },
          { type: "divider" },
          { label: "OPERACIONES", type: "group", children: [
            { label: "POS Anotalo", icon: "ShopOutlined", route: "/pos/anotalo" },
          ]},
          { label: "ENTIDADES", type: "group", children: [
            { label: "Clientes", icon: "UsergroupAddOutlined", route: "/entidades/clientes" },
            { label: "Proveedores", icon: "DeliveredProcedureOutlined", route: "/entidades/proveedores" },
          ]},
          { label: "REPORTES", type: "group", children: [
            { label: "Reporte Caja", icon: "BankOutlined", route: "/reportes/caja" },
            { label: "Cta Corriente", icon: "FileTextOutlined", route: "/reportes/ctacte" },
            { label: "Movimientos", icon: "UnorderedListOutlined", route: "/movimientos" },
          ]},
          { label: "CONFIGURACIÓN", type: "group", children: [
            { label: "Formas de Pago", icon: "SettingOutlined", route: "/more/formas-pago" },
          ]},
        ],
      },
    },
    header: {
      show: true,
      height: 64,
      left: { icon: "HomeOutlined", action: "navigate('/')" },
      center: { text: "orgName" },
      right: ["Instalar App (PWA)", "CardUser"],
    },
    dashboard: {
      containerWidth: "50%",
      centered: true,
      sections: ["ResumenCards", "AccesoReportes"],
      accesosDirectos: false, // removed from desktop
    },
  },
  mobile: {
    topBar: {
      show: true,
      left: { logo: "/images/Logo.png", height: 28 },
      center: { text: "orgName", color: "#1890ff" },
      right: "CardUser",
    },
    bottomNav: {
      show: true,
      height: 64,
      items: [
        { key: "inicio", icon: "MdHome", label: "Inicio", route: "/" },
        { key: "movimientos", icon: "MdListAlt", label: "Movimientos", route: "/movimientos" },
        { key: "pos", icon: "MdStore", label: "POS", route: "/pos/anotalo", featured: true },
        { key: "nominas", icon: "MdPeople", label: "Nóminas", route: "/entidades" },
        { key: "mas", icon: "MdMoreHoriz", label: "Más", route: "/more" },
      ],
    },
    dashboard: {
      containerWidth: "100%",
      centered: false,
      sections: ["ResumenCards", "AccesoReportes"],
    },
    moreMenu: {
      route: "/more",
      sections: ["OPERACIONES", "ENTIDADES", "REPORTES", "CONFIGURACIÓN"],
    },
  },
};
