import { PlusOutlined } from "@ant-design/icons";
import { Button, Table, Typography, message } from "antd";
import { useState } from "react";
import CreateOrderModal from "./CreateOrderModal";

const OrderTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {contextHolder}
      <div className="w-full h-full py-4">
        <Table
          rowKey={(row) => row._id}
          //   columns={columns}
          //   dataSource={departments}
          bordered
          scroll={{ x: 2000 }}
          pagination={{ pageSize: 3 }}
          title={() => (
            <div className="flex items-center justify-between">
              <Typography.Title className="mb-0" level={3}>
                Danh sách đơn hàng
              </Typography.Title>
              <CreateOrderModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
              <Button
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
                type="primary"
                size="large"
              >
                Tạo đơn
              </Button>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default OrderTable;
