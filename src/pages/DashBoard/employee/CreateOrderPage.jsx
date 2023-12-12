import { Divider, Typography } from "antd";

import OrderTable from "../../../../src/components/Staff/transaction/OrderTable";

const CreateOrderPage = () => {
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Quản lý đơn hàng
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <OrderTable />
      </div>
    </div>
  );
};

export default CreateOrderPage;
