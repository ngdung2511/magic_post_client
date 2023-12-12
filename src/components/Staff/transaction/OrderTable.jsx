import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, Table, Typography, message } from "antd";
import { useState } from "react";
import CreateOrderModal from "./CreateOrderModal";

const OrderTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = [
    {
      _id: "1",
      orderCode: "DH001",
      senderName: "Nguyễn Văn A",
      receiverName: "Nguyễn Văn B",
      receiverAddress: "123 Phạm Văn Đồng, P. Linh Đông, Q. Thủ Đức, TP. HCM",
      receiverPhone: "0123456789",
      status: "delivered",
    },
    {
      _id: "2",
      orderCode: "DH002",
      senderName: "Nguyễn Văn C",
      receiverName: "Nguyễn Văn D",
      receiverAddress: "123 Phạm Văn Đồng, P. Linh Đông, Q. Thủ Đức, TP. HCM",
      receiverPhone: "0123456789",
      status: "delivered",
    },
    {
      _id: "3",
      orderCode: "DH003",
      senderName: "Nguyễn Văn E",
      receiverName: "Nguyễn Văn F",
      receiverAddress: "123 Phạm Văn Đồng, P. Linh Đông, Q. Thủ Đức, TP. HCM",
      receiverPhone: "0123456789",
      status: "delivered",
    },
    {
      _id: "4",
      orderCode: "DH004",
      senderName: "Nguyễn Văn G",
      receiverName: "Nguyễn Văn H",
      receiverAddress: "123 Phạm Văn Đồng, P. Linh Đông, Q. Thủ Đức, TP. HCM",
      receiverPhone: "0123456789",
      status: "delivered",
    },
    {
      _id: "5",
      orderCode: "DH005",
      senderName: "Nguyễn Văn I",
      receiverName: "Nguyễn Văn K",
      receiverAddress: "123 Phạm Văn Đồng, P. Linh Đông, Q. Thủ Đức, TP. HCM",
      receiverPhone: "0123456789",
      status: "delivered",
    },
  ];
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Người gửi",
      dataIndex: "senderName",
      key: "senderName",
    },
    {
      title: "Người nhận",
      dataIndex: "receiverName",
      key: "receiverName",
    },
    {
      title: "Địa chỉ nhận",
      dataIndex: "receiverAddress",
      key: "receiverAddress",
    },
    {
      title: "Số điện thoại",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (record, value) => {
        console.log(record);
        return (
          <Select
            style={{
              width: "100%",
            }}
            defaultValue={record}
            options={[
              { label: "Đã giao", value: "delivered" },
              { label: "Đang giao", value: "pending" },
              { label: "Đã hủy", value: "rejected" },
              { label: "Đã xác nhận", value: "accepted" },
            ]}
          />
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div className="flex items-center gap-x-[10px]">
          <Button
            onClick={() => messageApi.success("Đã xóa đơn hàng thành công!")}
            danger
            type="primary"
            size="small"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <div className="w-full h-full py-4">
        <Table
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={data}
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
