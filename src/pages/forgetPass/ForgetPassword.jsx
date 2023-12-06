import { Button, Form, Input, Steps } from "antd";

import Container from "../../components/Container";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkVerifyCode, forgetPassword } from "../../repository/auth/auth";

const ForgetPassword = () => {
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    // nếu tồn tại email thì gửi code và chuyển sang bước 2
    if (current === 0) {
      await forgetPassword(values.email);
    }
    if (current === 1) {
      setInfo({
        token: values.OTP,
      })
       
    }
    if (current === 2) {
      const data = {
        password: values.newPassword,
        token: info.token,
      }
      await checkVerifyCode(data);
    } else setCurrent(current + 1);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [info, setInfo] = useState({});

  // useEffect(async () => {
  //   await checkVerifyCode(info);
  // }, [info, flag]);

  const stepButton = () => {
    let text = "";
    if (current === 0) {
      text = "Gửi mã xác minh";
    } else if (current === 1) {
      text = "Xác nhận";
    } else {
      text = "Khôi phục tài khoản";
    }
    return (
      <Button
        className={current === 0 || current === 2 ? "w-full" : ""}
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
      title: "Email đã đăng ký",
      content: (
        <>
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
      title: "Mã xác minh",
      content: (
        <>
          <Form.Item name="OTP">
            <Input size="large" type="text" placeholder="Nhập mã OTP" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Nhập mật khẩu mới",
      content: (
        <>
          <Form.Item name="newPassword">
            <Input
              size="large"
              type="text"
              placeholder="Mật khẩu mới của bạn"
            />
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
    <Container>
      <div className="flex items-center justify-center mt-[100px]">
        <div>
          <h1 className="mb-4 text-4xl text-center">Đặt lại mật khẩu</h1>
          <Steps current={current} items={items} />
          <Form
            onFinish={onFinish}
            name="forget-password-form"
            className="flex flex-col justify-center max-w-md mx-auto"
          >
            <div className="mt-[20px]">{steps[current].content}</div>
            <div className="flex items-center justify-between">
              {backButton()}
              {stepButton()}
            </div>
          </Form>
          <Link to={"/home/login"}>
            <Button type="link" className="float-right mt-4">
              <span className="text-base underline">Đăng nhập?</span>
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default ForgetPassword;
