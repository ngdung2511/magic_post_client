import { InfoCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";

const AddSiteModal = ({ isModalOpen, setIsModalOpen }) => {
  // Handle form logic
  const [form] = useForm();
  const siteLocation = Form.useWatch("siteLocation", {
    form,
    preserve: true,
  });
  // console.log(senderLocation);
  useEffect(() => {
    form.setFieldValue(
      "detailSiteLocation",
      `${siteLocation?.reverse().join(", ")}`
    );
  }, [siteLocation, form]);

  // Handle modal
  const handleOk = () => {
    setIsModalOpen(false);
    onHandleFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onHandleFinish = (values) => {
    form.resetFields();
    console.log(values);
  };

  // Tree data for selection input
  const treeSelectData = [
    {
      value: "Hà Nội",
      label: "Hà Nội",
      children: [
        {
          value: "Bắc Từ Liêm",
          label: "Bắc Từ Liêm",
        },
        {
          value: "Nam Từ Liêm",
          label: "Nam Từ Liêm",
        },
        {
          value: "Cầu Giấy",
          label: "Cầu Giấy",
        },
        {
          value: "Hoàng Mai",
          label: "Hoàng Mai",
        },
      ],
    },
    {
      value: "Hồ Chí Minh",
      label: "Hồ Chí Minh",
      children: [
        {
          value: "Quận 1",
          label: "Quận 1",
        },
        {
          value: "Quận 2",
          label: "Quận 2",
        },
        {
          value: "Quận Thủ Đức",
          label: "Quận Thủ Đức",
        },
        {
          value: "Quận Thủ Dầu Một",
          label: "Quận Thủ Dầu Một",
        },
      ],
    },
  ];
  return (
    <Modal
      title={
        <>
          <h1 className="mb-[10px] text-3xl font-semibold">
            <PlusCircleTwoTone style={{ color: "#e1ebfe" }} />
            <span className="ml-[10px]">Thêm điểm</span>
          </h1>
        </>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="w-full h-full pb-6">
        <Form form={form} onFinish={onHandleFinish}>
          <h2 className="py-3 text-xl font-semibold">Thông tin Điểm</h2>
          <div className="grid w-full col-span-8 gap-x-3 gap-y-0">
            <div className="col-span-4">
              <Form.Item name="siteName">
                <Input size="large" placeholder="Tên điểm" type="text" />
              </Form.Item>
            </div>
            <div className="col-span-4 col-start-5">
              <Form.Item name="siteType">
                <Select
                  size="large"
                  placeholder="Chọn loại điểm"
                  allowClear
                  options={[
                    {
                      value: "collection",
                      label: "Tập kết",
                    },
                    {
                      value: "transaction",
                      label: "Giao dịch",
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="col-span-8">
              <Form.Item name="siteLocation">
                <Cascader
                  size="large"
                  placeholder="Chọn TP/Tỉnh, quận/huyện"
                  options={treeSelectData}
                />
              </Form.Item>
              <Form.Item dependencies={["siteLocation"]} noStyle>
                {({ getFieldValue }) =>
                  getFieldValue("siteLocation") !== undefined ? (
                    <Form.Item
                      name="detailSiteLocation"
                      help={
                        <p className="flex items-center">
                          <InfoCircleOutlined />
                          <span className="ml-2 font-semibold">
                            Nhập địa chỉ chi tiết
                          </span>
                        </p>
                      }
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Địa chỉ chi tiết"
                        onChange={(e) => console.log(e.target.value)}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </div>
          </div>
          <h2 className="py-3 text-xl font-semibold">Thông tin trưởng điểm</h2>
          <div className="grid w-full col-span-8 gap-x-6">
            <div className="col-span-4">
              <Form.Item name="recipientName">
                <Input
                  size="large"
                  placeholder="Tên người nhận hàng"
                  type="text"
                />
              </Form.Item>
              <Form.Item name="recipientEmail">
                <Input
                  size="large"
                  placeholder="Email người nhận hàng"
                  type="email"
                />
              </Form.Item>
            </div>
            <div className="col-span-4 col-start-5">
              <Form.Item name="recipientAddress">
                <Input
                  size="large"
                  placeholder="Địa chỉ người nhận"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name="recipientPhoneNumber"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  placeholder="Số điện thoại người nhận"
                  type="number"
                />
              </Form.Item>
            </div>
          </div>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" className="float-right">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddSiteModal;
