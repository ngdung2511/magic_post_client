import { Divider, Radio, Typography } from "antd";
// import CollectionPointTable from "../../../components/BossPage/CollectionPointTable";
import PointList from "../../../components/BossPage/PointList";
import Statistics from "../../../components/BossPage/Statistics";

import { useStoreActions, useStoreState } from "../../../store/hook";
import { useEffect, useState } from "react";

import LineChart from "../../../components/charts/LineChart";
import moment from "moment/moment";
import DonutChart from "../../../components/charts/PieChart";

const ManagePointOrders = () => {
  const [chartTime, setChartTime] = useState("month");
  const [formattedOrder, setFormattedOrder] = useState({});
  const fetchAllOrders = useStoreActions((actions) => actions.fetchAllOrders);
  const [orderDates, setOrderDates] = useState([]);
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);
  const orders = useStoreState((state) => state.orders);
  console.log("orders", orders);

  // Categorize orders into months
  useEffect(() => {
    const monthCounts = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    const quarterCounts = {
      "Quý 1": 0,
      "Quý 2": 0,
      "Quý 3": 0,
      "Quý 4": 0,
    };
    const orderYears = orders.map((order) => moment(order.createdAt).year());
    const uniqueOrderYears = [...new Set(orderYears)].sort((a, b) => a - b);
    const yearCounts = uniqueOrderYears.map((year) => ({
      time: year,
      value: 0,
    }));
    console.log("orderYears", yearCounts);

    const formatOrders = (data) =>
      Object.entries(data).map(([time, value]) => ({
        time,
        value,
      }));

    if (orders.length > 0 && chartTime === "month") {
      orders.forEach((order) => {
        const month = moment(order.createdAt).format("MMMM");
        monthCounts[month]++;
      });
      setOrderDates(formatOrders(monthCounts));
    } else if (orders.length > 0 && chartTime === "quarter") {
      orders.forEach((order) => {
        const quarter = moment(order.createdAt).quarter();
        console.log("dfwafwa", quarter);
        if (quarter === 1) {
          quarterCounts["Quý 1"]++;
        } else if (quarter === 2) {
          quarterCounts["Quý 2"]++;
        } else if (quarter === 3) {
          quarterCounts["Quý 3"]++;
        } else if (quarter === 4) {
          quarterCounts["Quý 4"]++;
        }
      });
      setOrderDates(formatOrders(quarterCounts));
    } else if (orders.length > 0 && chartTime === "year") {
      orders.forEach((order) => {
        const year = moment(order.createdAt).year();
        yearCounts.forEach((item) => {
          if (item.time === year) {
            item.value++;
          }
        });
      });
      setOrderDates(yearCounts);
    }
  }, [orders, chartTime]);
  console.log("orderDates", orderDates);
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
  console.log("formattedOrders", formattedOrder);

  const { processing, accepted, rejected, delivered } = formattedOrder;
  const pieChartData = {
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
        borderColor: "rgb(245,245,245)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",
        },
      },
    },
  };
  const monthLabels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const lineChartData = {
    labels:
      chartTime === "month" ? monthLabels : orderDates.map((item) => item.time),
    datasets: [
      {
        label: "Đơn hàng",
        data: orderDates.map((item) => item.value),
        borderColor: "rgb(38,97,145)",
        backgroundColor: "rgb(245,245,245)",
      },
    ],
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
        <div className="w-full flex justify-end my-3">
          <Radio.Group
            size="medium"
            onChange={(e) => setChartTime(e.target.value)}
            defaultValue="month"
            buttonStyle="solid"
          >
            <Radio.Button value="month">Tháng</Radio.Button>
            <Radio.Button value="quarter">Quý</Radio.Button>
            <Radio.Button value="year">Năm</Radio.Button>
          </Radio.Group>
        </div>
        <div className="w-full grid md:grid-cols-6 grid-cols-1 gap-6">
          <div className="order-last md:order-none md:col-span-2 col-span-full bg-white w-full flex justify-center items-center rounded-xl py-4 px-2">
            <DonutChart chartData={pieChartData} options={options} />
          </div>
          <div className="md:col-span-4 col-span-full bg-white w-full flex justify-center items-center rounded-xl py-4 px-2">
            <LineChart chartData={lineChartData} options={options} />
          </div>
        </div>
        <PointList />
      </div>
    </div>
  );
};

export default ManagePointOrders;
