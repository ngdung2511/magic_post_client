import { Button, Form, Input } from "antd";
import Container from "../../components/Container";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signin } from "../../repository/auth/auth";
import { useStoreActions, useStoreState } from "../../store/hook";
import Swal from "sweetalert2";

const Login = () => {
  const currentUser = useStoreState((state) => state.currentUser);
  const setUserInfo = useStoreActions((actions) => actions.setUserInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.loggedIn) {
      console.log("User has logged in:", currentUser?.loggedIn);
      navigate("/dashboard");
    }
  }, [currentUser?.loggedIn, navigate]);

  const onFinish = async (values) => {
    try {
      const res = await signin(values.email, values.password);
      console.log(res.data.data);
      setUserInfo({
        email: res.data.data.user.email,
        password: res.data.data.user.name,
        loggedIn: true,
      });

      if (res.data.status === 200) {}
    } catch (error) {
      console.log(error);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Tên đăng nhập hoặc mật khẩu không đúng`,
        showConfirmButton: true,
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
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
    </>
  );
};
export default Login;
