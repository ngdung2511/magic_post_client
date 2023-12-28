import { Divider, Typography } from "antd";
// import CollectionPointTable from "../../../components/BossPage/CollectionPointTable";
import PointList from "../../../components/BossPage/PointList";
import Statistics from "../../../components/BossPage/Statistics";
import PieChart from "../../../components/charts/PieChart";
import { useStoreActions, useStoreState } from "../../../store/hook";
import { useEffect, useState } from "react";

const ManagePointOrders = () => {
  const [formattedOrder, setFormattedOrder] = useState({});
  const fetchAllOrders = useStoreActions((actions) => actions.fetchAllOrders);
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);
  const orders = useStoreState((state) => state.orders);

  // Categorize orders into types of status
  useEffect(() => {
    if (orders.length > 0) {
      const processing = [];
      const accepted = [];
      const rejected = [];
      const delivered = [];

      orders.forEach((item) => {
        if (item.status === "processing") {
          processing.push(item);
        } else if (item.status === "accepted") {
          accepted.push(item);
        } else if (item.status === "rejected") {
          rejected.push(item);
        } else if (item.status === "delivered") {
          delivered.push(item);
        }
      });

      setFormattedOrder({ processing, accepted, rejected, delivered });
    }
  }, [orders]);
  console.log("fajfghwakf", formattedOrder);
  const { processing, accepted, rejected, delivered } = formattedOrder;
  const chartData = {
    labels: [
      "Chờ xác nhận",
      "Đã xác nhận",
      "Chuyển tiếp thất bại",
      "Giao thành công",
    ],
    datasets: [
      {
        // label: "test",
        data: [
          processing?.length,
          accepted?.length,
          rejected?.length,
          delivered?.length,
        ],
        backgroundColor: [
          "rgb(255,202,58)",
          "rgb(87,198,237)",
          "rgb(238,77,45)",
          "rgb(34,197,94)",
        ],
        borderColor: [
          "rgb(87,198,237)",
          "rgb(255,202,58)",
          "rgb(254,148,150)",
          "rgb(73,217,195)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Thống kê hàng hóa
      </Typography.Title>
      <Divider />

      <div className="w-full">
        <div className="mb-5">
          <Statistics />
        </div>
        <div className="w-full grid grid-cols-6">
          <div className="col-span-2 bg-white w-full flex justify-center items-center rounded-xl py-4 px-2">
            <PieChart chartData={chartData} options={options} />
          </div>
          <div className="col-span-4"></div>
        </div>
        <PointList />
      </div>
    </div>
  );
};

export default ManagePointOrders;
