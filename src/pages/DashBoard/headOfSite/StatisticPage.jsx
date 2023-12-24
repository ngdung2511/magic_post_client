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
    const [orders, setOrders] = useState(0);
    const [employees, setEmployees] = useState(0);
    useEffect(() => {
        const fetchOrder = async() => {
            const res = await getOrderByDepartmentId(department._id);
            console.log('order number', department._id, res);
            setOrders(res.data.orders.length);
        }

        const fetchEmployee = async() => {
            const res = await getEmployeeByDepartmentId(department);
            console.log('employ nums', res);
            setEmployees(res.data.data.users.length - 1);
        }
        fetchOrder();
        fetchEmployee();
        
    }, [department]);
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
              value={orders}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Nhân viên"
              value={employees}
            />
          </Card>
        </div>
        {department.type === 'Gathering' ? <GatheringPage/> : <TransactionPage/>}
      </div>
    </div>
  );
};

export default StatisticPage;
