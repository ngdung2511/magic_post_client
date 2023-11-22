import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { Button, Divider, Image, Input, Typography } from "antd";
import Container from "../../components/Container";

import trackOrderImg from "../../assets/track-order.jpg";
import { SearchOutlined } from "@ant-design/icons";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="mt-[100px] mb-[50px]">
        <Outlet />
      </div>
      <Container>
        <Divider>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Theo dõi đơn hàng
          </h2>
        </Divider>
        <div className="flex items-center justify-center gap-3">
          <div className="w-[60%]">
            <Input prefix={<SearchOutlined />} allowClear size="large" />
          </div>
          <Button size="large">Tra cứu</Button>
        </div>
        <Image
          height={460}
          width="100%"
          className="object-contain"
          preview={false}
          src={trackOrderImg}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
