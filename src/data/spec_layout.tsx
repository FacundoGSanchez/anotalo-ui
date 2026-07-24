interface LayoutLogo {
  src: string;
  alt: string;
  title: string;
  wrapper: string;
  icon: string;
  titleEl: string;
}

interface LayoutSidebarMenu {
  component: string;
  dataSource: string;
  mode: string;
  theme: string;
  style: string;
  sections: string[];
  permissionFilter: string;
}

interface LayoutSidebar {
  type: string;
  width: number;
  theme: string;
  fixed: boolean;
  logo: LayoutLogo;
  menu: LayoutSidebarMenu;
  profile: boolean;
}

interface LayoutNavbarSection {
  content: string | string[];
  width?: string;
  align?: string;
  action?: string;
  src?: string;
}

interface LayoutProfilePopover {
  userInfo: string;
  orgSection: string;
  sucursalSection: string;
  logout: string;
}

interface LayoutProfile {
  component: string;
  type: string;
  trigger: string;
  placement: string;
  avatarSize: string;
  popoverContent: LayoutProfilePopover;
}

interface LayoutNavbar {
  component: string;
  type: string;
  height: number | string;
  position: string;
  background: string;
  layout: string;
  left: LayoutNavbarSection;
  center: LayoutNavbarSection;
  right: LayoutNavbarSection;
  profile?: LayoutProfile;
}

interface LayoutDashboard {
  component: string;
  containerWidth: string;
  centered: boolean;
  maxWidth?: null;
  sections: string[];
  accesosDirectos?: boolean;
  paddingBottom?: string;
}

interface LayoutDesktop {
  sidebar: LayoutSidebar;
  navbar: LayoutNavbar;
  dashboard: LayoutDashboard;
}

interface BottomNavItem {
  key: string;
  icon: string;
  label: string;
  route: string;
  featured?: boolean;
}

interface LayoutNavbottom {
  component: string;
  type: string;
  height: number;
  background: string;
  borderTop: string;
  zIndex: number;
  safeArea: string;
  items: BottomNavItem[];
  activeState: string;
  featuredItem: string;
}

interface LayoutMobileNavbar {
  component: string;
  type: string;
  height: string;
  borderBottom: string;
  background: string;
  left: LayoutNavbarSection;
  center: LayoutNavbarSection;
  right: LayoutNavbarSection;
}

interface LayoutMoreMenuPageHeader {
  content: string;
  borderBottom: string;
}

interface LayoutMoreMenuPage {
  component: string;
  route: string;
  style: string;
  background: string;
  theme: string;
  header: LayoutMoreMenuPageHeader;
  menu: LayoutSidebarMenu;
}

interface LayoutMobileDashboard {
  component: string;
  containerWidth: string;
  centered: boolean;
  sections: string[];
  paddingBottom: string;
}

interface LayoutMobile {
  navbar: LayoutMobileNavbar;
  navbottom: LayoutNavbottom;
  menumorepage: LayoutMoreMenuPage;
  dashboard: LayoutMobileDashboard;
}

export interface LayoutSpec {
  desktop: LayoutDesktop;
  mobile: LayoutMobile;
}

export const LAYOUT_SPEC: LayoutSpec = {
  desktop: {
    sidebar: {
      type: "Sider (Ant Design)",
      width: 240,
      theme: "dark",
      fixed: true,
      logo: {
        src: "/images/Logo.png",
        alt: "Logo Anótalo",
        title: "Anótalo",
        wrapper: ".sidebar-logo",
        icon: ".sidebar-logo__icon (círculo blanco 40px)",
        titleEl: "h1.sidebar-logo__title (blanco, 18px, 700)",
      },
      menu: {
        component: "MenuList (src/components/MenuList.jsx)",
        dataSource: "MenuItems (src/data/MenuItems.jsx)",
        mode: "inline",
        theme: "dark",
        style: `.ant-menu-dark.ant-menu-inline (transparent bg)
               .ant-menu-dark .ant-menu-item (44px height, 14px, #8c8ca1, border-radius 10px)
               .ant-menu-dark .ant-menu-item-group-title (11px, 700, uppercase, #5a5d72)
               .ant-menu-dark .ant-menu-item-selected (#fff, azul overlay)`,
        sections: [
          "Inicio (standalone, HomeOutlined, ruta /)",
          "OPERACIONES → POS Anotalo (ShopOutlined)",
          "ENTIDADES → Clientes (UsergroupAddOutlined), Proveedores (DeliveredProcedureOutlined)",
          "GESTIONES → Caja, Cta Corriente, Saldo Ctas Ctes, Movimientos, Resumen Ventas",
          "COMPRAS → Compras, Pedidos",
          "CONFIGURACIONES → Config POS, Rubros, Formas de Pago, Sucursales, Usuarios",
        ],
        permissionFilter: "filterItemsByPermission() en MenuList",
      },
      profile: false,
    },

    navbar: {
      component: "AppHeader (src/layout/Header/AppHeader.jsx)",
      type: "Ant Design Header",
      height: 64,
      position: "sticky, top: 0, z-index: 10",
      background: "#f5f5f5",
      layout: "flex, space-between, 3 columnas",
      left: {
        content: "Botón Home (HomeOutlined)",
        width: "20%",
        action: "navega a /",
      },
      center: {
        content: "Nombre de organización (15px bold, #3f4a6d) + sucursal (11px, #8c8c8c)",
        align: "center",
      },
      right: {
        content: ["Botón Instalar App (PWA, condicional)", "CardUser (Avatar + Popover)"],
        width: "20%",
        align: "flex-end",
      },
      profile: {
        component: "CardUser (src/layout/CardUser/CardUser.jsx)",
        type: "Avatar + Popover (Ant Design)",
        trigger: "hover",
        placement: "bottomRight",
        avatarSize: "large",
        popoverContent: {
          userInfo: "Avatar 64px, nombre, rol, email",
          orgSection: "Organización actual + botones cambio (rol 1 + multi org)",
          sucursalSection: "Sucursal actual + botones cambio (multi sucursal)",
          logout: "Botón Cerrar Sesión (LogoutOutlined, danger)",
        },
      },
    },

    dashboard: {
      component: "Content (Ant Design Layout) + Outlet (react-router)",
      containerWidth: "50%",
      centered: true,
      maxWidth: null,
      sections: ["ResumenCards", "AccesoReportes"],
      accesosDirectos: false,
    },
  },

  mobile: {
    navbar: {
      component: "Inline top bar (MainLayout.jsx, líneas 35-63)",
      type: "Flex row, sticky top",
      height: "auto (padding 8px 16px)",
      borderBottom: "1px solid colorBorderSecondary",
      background: "colorBgContainer (Ant Design theme)",
      left: {
        content: "Logo (28px height)",
        src: "/images/Logo.png",
      },
      center: {
        content: "Nombre de organización (15px bold, #3f4a6d) + sucursal (11px, #8c8c8c)",
        align: "center",
      },
      right: {
        content: "CardUser (Avatar + Popover)",
      },
    },

    navbottom: {
      component: "BottomNav (src/layout/BottomNav/BottomNav.jsx)",
      type: "Fixed bar, bottom: 0",
      height: 64,
      background: "#ffffff",
      borderTop: "1px solid #f0f0f0",
      zIndex: 1000,
      safeArea: "padding-bottom: env(safe-area-inset-bottom, 0)",
      items: [
        { key: "inicio", icon: "MdHome", label: "Inicio", route: "/" },
        { key: "movimientos", icon: "MdListAlt", label: "Movimientos", route: "/movimientos" },
        { key: "pos", icon: "MdStore", label: "POS", route: "/pos/anotalo", featured: true },
        { key: "nominas", icon: "MdPeople", label: "Nóminas", route: "/entidades" },
        { key: "mas", icon: "MdMoreHoriz", label: "Más", route: "/more" },
      ],
      activeState: "Comparación de location.pathname (startsWith)",
      featuredItem: "POS (círculo azul 52px, -18px margin-top, sombra)",
    },

    menumorepage: {
      component: "MoreMenuPage (src/pages/MoreMenu/MoreMenuPage.jsx)",
      route: "/more",
      style: "sidebar-duplicate",
      background: "#0f1219",
      theme: "dark",
      header: {
        content: "Botón back (MdArrowBack) + título 'Menú' (18px bold, blanco)",
        borderBottom: "1px solid #1e2230",
      },
      menu: {
        component: "MenuList (src/components/MenuList.jsx) con darkTheme",
        dataSource: "MenuItems (src/data/MenuItems.jsx) — mismo que sidebar desktop",
        mode: "inline",
        theme: "dark",
        style: "",
        sections: [
          "Inicio (standalone, HomeOutlined, ruta /)",
          "OPERACIONES → POS Anotalo",
          "ENTIDADES → Clientes, Proveedores",
          "GESTIONES → Caja, Cta Corriente, Saldo Ctas Ctes, Movimientos, Resumen Ventas",
          "COMPRAS → Compras, Pedidos",
          "CONFIGURACIONES → Config POS, Rubros, Formas de Pago, Sucursales, Usuarios",
        ],
        permissionFilter: "filterItemsByPermission() en MenuList (mismo que sidebar)",
      },
    },

    dashboard: {
      component: "Content (Ant Design Layout) + Outlet (react-router)",
      containerWidth: "100%",
      centered: false,
      sections: ["ResumenCards", "AccesoReportes"],
      paddingBottom: "80px (para evitar superposición con BottomNav)",
    },
  },
};
