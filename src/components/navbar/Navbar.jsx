import { Avatar, Dropdown, Image, Modal } from "antd";
import Container from "../Container";
import { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

import logo from "../../assets/logo.svg";
const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is logged in
  const currentUser = false;
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: "1",
      label: <span onClick={showModal}>Thông tin cá nhân</span>,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center w-full text-red-500">
          <span className="w-full text-center">
            Đăng xuất <LogoutOutlined />
          </span>
        </span>
      ),
    },
  ];
  return (
    <div className="w-full h-[64px] bg-white fixed top-0 right-0 left-0 z-50 mb-[64px] shadow-md">
      <Container>
        <div className="flex items-center justify-between w-full h-full">
          <Image src={logo} preview={false} />
          {currentUser && (
            <>
              <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow={{ pointAtCenter: true }}
              >
                <Avatar
                  className="border-black cursor-pointer"
                  size={50}
                  src="https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Boo"
                />
              </Dropdown>
              <Modal
                title={<h1 className="w-full text-2xl">Thông tin cá nhân</h1>}
                onOk={handleOk}
                onCancel={handleCancel}
                open={isModalOpen}
              >
                <ul className="font-semibold list-none">
                  <li>
                    Họ và tên: <span>Nguyễn Huy Dũng</span>
                  </li>
                  <li>
                    Email: <span>huydung.jp@gmail.com</span>
                  </li>
                  <li>
                    Ngày sinh: <span>25/11/1969</span>
                  </li>
                  <li>
                    Số điện thoại <span>0989989989</span>
                  </li>
                </ul>
                <h3 className="text-lg">Chức vụ</h3>
                <p>Giao dịch viên</p>
                <h3 className="text-lg">Điểm giao dịch</h3>
                <p>Số 120, đường Hoàng Quốc Việt, quận Cầu Giấy, Hà Nội</p>
              </Modal>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
