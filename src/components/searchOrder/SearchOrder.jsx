import { Button, Form, Image, Input, Steps } from "antd";

import trackOrderImg from "../../assets/track-order.jpg";
import { SearchOutlined } from "@ant-design/icons";

import { useState } from "react";
import OrderInfo from "./orderInfo/OrderInfo";
import OrderStatus from "./orderStatus/OrderStatus";
const SearchOrder = () => {
  const [orderInfo, setOrderInfo] = useState(true);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const [current, setCurrent] = useState(1);
  const steps = [
    {
      title: "Đã xác nhận đơn hàng",
      content: <OrderInfo />,
    },
    {
      title: "Đang vận chuyển",
      content: <OrderStatus />,
    },
    {
      title: "Giao hàng thành công",
      content: "Last-content",
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <Form
        onFinish={onFinish}
        name="track-order-form"
        className="flex items-center justify-center gap-3 mb-[20px]"
      >
        <Form.Item noStyle name="orderCode">
          <Input
            className="w-[60%]"
            placeholder="Nhập mã đơn hàng của bạn"
            prefix={<SearchOutlined />}
            allowClear
            size="large"
          />
        </Form.Item>
        <Button htmlType="submit" size="large">
          Tra cứu
        </Button>
      </Form>
      {orderInfo ? (
        <div className="w-full min-h-[480px] shadow-lg rounded-lg p-4">
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
        </div>
      ) : (
        <Image
          height={460}
          width="100%"
          className="object-contain"
          preview={false}
          src={trackOrderImg}
        />
      )}
    </>
  );
};

export default SearchOrder;
