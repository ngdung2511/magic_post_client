import { Divider } from "antd";
import GatheringOrderTable from "../../../components/BossPage/GatheringOrderTable";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
export const OrdersListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full">
      <div className="flex items-center">
        <div onClick={() => navigate(-1)}>
          <LeftOutlined className="text-md hover:text-neutral-500 cursor-pointer" />
        </div>
        <Divider type="vertical" />
        <h1 className="font-semibold">Danh sách đơn hàng</h1>
      </div>
      <Divider />
      <div className="w-full">
        <GatheringOrderTable />
      </div>
    </div>
  );
};
