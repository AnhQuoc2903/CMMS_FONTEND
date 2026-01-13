import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="bg-white">
        <Sidebar />
      </Sider>

      <Layout>
        <Header className="bg-white shadow px-6">
          <h1 className="text-lg font-semibold">CMMS System</h1>
        </Header>

        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
