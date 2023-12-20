import { ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Divider, Statistic, Typography } from "antd";
import { useStoreState } from "../../../store/hook";
import { useEffect, useState } from "react";
import { getOrderByDepartmentId } from "../../../repository/order/order";
import { getEmployeeByDepartmentId } from "../../../repository/employee/employee";
import GatheringPage from "./GatheringPage";
import TransactionPage from "./TransactionPage";

const StatisticPage = () => {
    const currentUser = useStoreState((state) => state.currentUser);
    const department = currentUser.workDepartment;
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const res = await getOrderByDepartmentId(department._id);
            const res2 = await getEmployeeByDepartmentId(department._id);
            console.log(res2);
            setOrders(res.data.orders);
            setEmployees(res2.data.data.users);
        }
        fetchData();
    }, [department._id]);
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Thống kê điểm {department.type === 'Gathering' ? 'tập kết' : 'giao dịch'} {department.address}
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Số đơn hàng"
              value={orders.length}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Nhân viên"
              value={employees.length}
            />
          </Card>
        </div>
        {department.type === 'Gathering' ? <GatheringPage/> : <TransactionPage/>}
      </div>
    </div>
  );
};

export default StatisticPage;
