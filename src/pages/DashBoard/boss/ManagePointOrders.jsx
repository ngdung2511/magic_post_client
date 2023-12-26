import { Divider, Typography } from "antd";
import CollectionPointTable from "../../../components/BossPage/CollectionPointTable";
import PointList from "../../../components/BossPage/PointList";

const ManagePointOrders = () => {
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Thống kê hàng hóa
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <PointList />
      </div>
    </div>
  );
};

export default ManagePointOrders;
