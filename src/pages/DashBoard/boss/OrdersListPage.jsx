import { Divider, Typography } from "antd";
import GatheringOrderTable from "../../../components/BossPage/GatheringOrderTable";

export const OrdersListPage = () => {
    
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        {`Danh sách đơn hàng`}
      </Typography.Title>
      <Divider />
      <div className="w-full">
      <GatheringOrderTable />
      </div>
    </div>
  )
}
