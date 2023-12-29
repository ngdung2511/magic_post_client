import { Result, Button } from "antd";

function NotFound() {
  return (
    <Result
      status={404}
      title="404"
      subTitle="Trang không tồn tại."
      extra={
        <Button type="primary" href="/home">
          Quay lại
        </Button>
      }
    />
  );
}

export default NotFound;
