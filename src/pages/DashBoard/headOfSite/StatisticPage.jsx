import { ShoppingCartOutlined } from "@ant-design/icons";
import { AiOutlineTeam } from "react-icons/ai";
import { Card, Divider, Statistic, Typography } from "antd";
import { useStoreState } from "../../../store/hook";
import { useEffect, useState } from "react";
import { getOrderByCondition } from "../../../repository/order/order";
import { getEmployeeByDepartmentId } from "../../../repository/employee/employee";
import GatheringPage from "./GatheringPage";
import TransactionPage from "./TransactionPage";

const StatisticPage = () => {
    const currentUser = useStoreState((state) => state.currentUser);
    const department = currentUser.workDepartment;
    const [employees, setEmployees] = useState(0);
    const [ordersCurrent, setOrdersCurrent] = useState(0);
    const [ordersNext, setOrdersNext] = useState(0);
    const [ordersSend, setOrdersSend] = useState(0);
    const [ordersReceive, setOrdersReceive] = useState(0);

    useEffect(() => {
      const fetchOrderGather = async () => {
        const res = await getOrderByCondition({condition: {current_department: department._id}})
        const res2 = await getOrderByCondition({condition: {next_department: department._id}})
        
        if (res?.status === 200 && res2?.status === 200) {
          setOrdersCurrent(res.data.orders.length);
          setOrdersNext(res2.data.orders.length);
          
        }
      };
      fetchOrderGather();

      //
      const fetchOrderTrans = async () => {
        const res = await getOrderByCondition({condition: {send_department: department._id}})
        const res2 = await getOrderByCondition({condition: {receive_department: department._id}})
        
        if (res?.status === 200 && res2?.status === 200) {
          setOrdersSend(res.data.orders.length);
          setOrdersReceive(res2.data.orders.length);
        }
      }
      fetchOrderTrans();

      const fetchEmployee = async() => {
            const res = await getEmployeeByDepartmentId(department);
            console.log('employ nums', res);
            setEmployees(res.data.data.users.length - 1);
        }
        fetchEmployee();
        
    }, [department]);

    const gatheringStatistic = (
      <>
      <Card>
      <Statistic
        prefix={<ShoppingCartOutlined size={20} />}
        title="Số đơn hàng đang xử lý"
        value={ordersCurrent}
      />
      </Card>
      <Card>
      <Statistic
        prefix={<ShoppingCartOutlined size={20} />}
        title="Số đơn hàng sắp tới"
        value={ordersNext}
      />
      </Card>
      </>
    );

    const transactionStatistic = (
      <>
        <Card>
      <Statistic
        prefix={<ShoppingCartOutlined size={20} />}
        title="Số đơn hàng đã gửi"
        value={ordersSend}
      />
      </Card>
      <Card>
      <Statistic
        prefix={<ShoppingCartOutlined size={20} />}
        title="Số đơn hàng đã nhận"
        value={ordersReceive}
      />
      </Card>
      </>
    );

  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Thống kê điểm {department.type === 'Gathering' ? 'tập kết' : 'giao dịch'} {department.address}
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {department.type === 'Gathering' ? gatheringStatistic : transactionStatistic}
          <Card>
            <Statistic
              prefix={<AiOutlineTeam size={20} />}
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
