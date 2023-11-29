import { Button, Layout, Menu, Modal, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  AppleOutlined,
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/navbar/Navbar";

import { useStoreState } from "../../store/hook";
function DashBoard() {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const currentUser = useStoreState((state) => state.currentUser);
  console.log(currentUser);
  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem("selectedKey") || "1"
  );

  const handleClick = (e) => {
    localStorage.setItem("selectedKey", e.key);
    setSelectedKey(e.key);
  };

  function getItem(label, key, icon, children, disabled = false) {
    return {
      key,
      icon,
      children,
      label,
      disabled,
    };
  }
  const items = [
    getItem(
      <NavLink to="/">{"Dashboard"}</NavLink>,
      "1",
      <DashboardOutlined />
    ),
    getItem(
      <NavLink to="/inventory">{"Inventory"}</NavLink>,
      "2",
      <AppleOutlined />
    ),
    getItem("Nhân viên", "sub1", <AppleOutlined />, [
      getItem(<NavLink to="/employee/create-order">Tạo đơn hàng</NavLink>, "3"),
      // getItem("Bill", "4"),
      // getItem("Alex", "5"),
    ]),

    getItem(
      "Trưởng điểm",
      "sub2",
      <AppleOutlined />,
      [
        getItem(
          <NavLink to="head/collection-point/manage-accounts">
            Quản lý tài khoản
          </NavLink>,
          "6"
        ),
        getItem(
          <NavLink to="head/collection-point/goods-inventory">
            Thống kê hàng hóa
          </NavLink>,
          "7"
        ),
      ],
      currentUser?.role !== "headTransaction" &&
        currentUser?.role !== "headGathering"
    ),
    getItem(
      "Lãnh đạo",
      "sub3",
      <UserOutlined />,
      [
        getItem(<NavLink to="/boss/manage-sites">Quản lý điểm</NavLink>, "8"),
        getItem(
          <NavLink to="/boss/goods-stats">Thống kê hàng hóa</NavLink>,
          "9"
        ),
      ],
      currentUser?.role !== "admin"
    ),
  ];
  return (
    <Layout>
      <Navbar />
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            left: 0,
            top: 64,
            padding: "8px 0",
            background: colorBgContainer,
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="md"
          collapsedWidth="60"
        >
          <Menu
            className="overflow-y-auto"
            theme="light"
            defaultSelectedKeys={selectedKey}
            mode="inline"
            items={items}
            onClick={handleClick}
          />
        </Sider>
        <Layout
          style={{
            minHeight: "100vh",
            padding: "0 10px",
            display: "flex",
          }}
        >
          <Content
            style={{
              flexGrow: 1,
              height: "100vh",
              marginTop: "64px",
            }}
          >
            <div
              style={{
                height: "100vh",
                padding: 20,
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DashBoard;
