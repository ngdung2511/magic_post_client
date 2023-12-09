import { PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

const CreateOrderModal = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // Handle modal
  const handleOk = () => {
    setIsModalOpen(false);
    onHandleFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onHandleFinish = (values) => {
    console.log(values);
  };
  const typeOptions = [
    {
      label: "Tài liệu",
      value: "Document",
    },
    {
      label: "Hàng hóa",
      value: "Goods",
      checked: true,
    },
  ];

  return (
    <>
      <Modal
        footer={null}
        open={isModalOpen}
        title={
          <>
            <h1 className="mb-[16px] text-3xl font-semibold">
              <PlusCircleTwoTone twoToneColor="#f15757" />
              <span className="ml-[10px]">Tạo đơn hàng gửi</span>
            </h1>
          </>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="w-full h-full pb-6">
          <Form form={form} onFinish={onHandleFinish}>
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="senderName"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập tên người gửi",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Họ và tên người gửi"
                    type="text"
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="senderPhone"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập số điện thoại người gửi",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Số điện thoại người gửi"
                    type="text"
                  />
                </Form.Item>
              </div>

              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="receiverName"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập tên người nhận",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Họ và tên người nhận"
                    type="text"
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="receiverPhone"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập số điện thoại người nhận",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Số điện thoại người nhận"
                    type="text"
                  />
                </Form.Item>
              </div>
              <h2 className="py-2 text-xl font-semibold">Thông tin hàng hóa</h2>
              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="orderPrice"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập giá trị đơn hàng",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    addonAfter="VND"
                    size="large"
                    placeholder="Giá trị đơn hàng"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="orderWeight"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập khối lượng đơn hàng",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    addonAfter="KG"
                    size="large"
                    placeholder="Khối lượng đơn hàng"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </div>

              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="receiverDep"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng chọn Điểm giao dịch đích",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn Điểm giao dịch đích"
                    allowClear
                    options={typeOptions}
                  />
                </Form.Item>

                <Form.Item
                  name="orderType"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng chọn loại hàng hóa",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn loại hàng hóa"
                    allowClear
                    options={typeOptions}
                  />
                </Form.Item>
              </div>
              <Form.Item>
                <TextArea
                  showCount
                  maxLength={100}
                  style={{
                    height: 60,
                    resize: "none",
                  }}
                  placeholder="Mô tả đơn hàng"
                />
              </Form.Item>
            </div>

            <Form.Item noStyle>
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="float-right"
              >
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CreateOrderModal;
