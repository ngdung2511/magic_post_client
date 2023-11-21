import { Button, Form, Input } from "antd";
import Container from "../../components/Container";
import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <Container>
      <div className="flex items-center justify-center mt-[100px] grow">
        <div>
          <h1 className="mb-4 text-4xl text-center">Đăng nhập vào hệ thống</h1>
          <Form
            onFinish={onFinish}
            name="login-form"
            className="flex flex-col justify-center max-w-md mx-auto"
          >
            <Form.Item name="email">
              <Input
                size="large"
                type="email"
                placeholder="Nhập email của bạn"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                required
                size="large"
                type="password"
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={isLoading}
            >
              Đăng nhập
            </Button>

            <Link to={"/home/forget-password"}>
              <Button type="link" className="float-right mt-4">
                <span className="text-base underline">Quên mật khẩu ?</span>
              </Button>
            </Link>
          </Form>
        </div>
      </div>
    </Container>
  );
};
export default Login;
