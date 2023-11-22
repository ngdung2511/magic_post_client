import { Button, Form, Input, Steps } from "antd";

import Container from "../../components/Container";
import { useState } from "react";

const ForgetPassword = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    // nếu tồn tại email thì gửi code và chuyển sang bước 2

    if (current === 1) {
      console.log("Đổi mật khẩu");
    } else setCurrent(current + 1);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const stepButton = () => {
    let text = "";
    if (current === 0) {
      text = "Gửi mã xác minh";
    } else {
      text = "Khôi phục mật khẩu";
    }
    return (
      <Button
        className={current === 0 ? "w-full" : ""}
        size="large"
        type="primary"
        htmlType="submit"
        disabled={isLoading}
      >
        {text}
      </Button>
    );
  };
  const backButton = () => {
    if (current === 1) {
      return (
        <Button
          size="large"
          type="default"
          onClick={() => setCurrent(current - 1)}
        >
          Quay lại
        </Button>
      );
    }
    return null;
  };
  const steps = [
    {
      title: "Nhập email đã đăng ký",
      content: (
        <>
          {" "}
          <Form.Item name="email">
            <Input
              size="large"
              type="email"
              placeholder="Nhập email đã đăng ký"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Nhập mã xác minh",
      content: (
        <>
          {" "}
          <Form.Item name="OTP">
            <Input size="large" type="text" placeholder="Nhập mã OTP" />
          </Form.Item>
        </>
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <div className="flex items-center justify-center">
        <div>
          <h1 className="mb-4 text-4xl text-center">Lấy lại mật khẩu</h1>
          <Steps current={current} items={items} />
          <Form
            onFinish={onFinish}
            name="forget-password-form"
            className="flex flex-col justify-center mx-auto w-[400px]"
          >
            <div className="mt-[20px]">{steps[current].content}</div>
            <div className="flex items-center justify-between">
              {backButton()}
              {stepButton()}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
