import { FaWarehouse } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineTeam } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getDepartments } from "../../repository/department/department";
import { getAllOrders } from "../../repository/order/order";

import { getEmployeeByCondition } from "../../repository/employee/employee";
import StatsCard from "../StatsCard";

const Statistics = () => {
  const [departments, setDepartments] = useState({});
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDepartments();
      await fetchOrders();
      await fetchEmployees();
    };

    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data.departments);
      } catch (error) {
        // Handle error
        console.error("Error fetching departments:", error);
      }
    };

    const fetchOrders = async () => {
      const res = await getAllOrders();
      if (res?.status === 200) {
        setOrders(res.data.orders);
      }
    };

    const fetchEmployees = async () => {
      const condition = {
        role: { $ne: "admin" },
      };
      const stringifiedCondition = JSON.stringify(condition);
      const res = await getEmployeeByCondition(stringifiedCondition);
      if (res?.status === 200) {
        setEmployees(res.data.users);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      const transactionDeps = [];
      const gatheringDeps = [];

      departments.forEach((dep) => {
        if (dep.type === "Transaction") {
          transactionDeps.push(dep);
        } else {
          gatheringDeps.push(dep);
        }
      });

      setDepartments({ transactionDeps, gatheringDeps });
    }
  }, [departments]);

  console.log("departments", departments);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatsCard
          icon={FaWarehouse}
          label="Điểm tập kết"
          value={departments.gatheringDeps?.length}
          bgColor="bg-red-500"
        />
        <StatsCard
          icon={FaWarehouse}
          label="Điểm giao dịch"
          value={departments.transactionDeps?.length}
          bgColor="bg-yellow-500"
        />
        <StatsCard
          icon={FiShoppingCart}
          label="Đơn hàng"
          value={orders?.length}
          bgColor="bg-green-500"
        />
        <StatsCard
          icon={AiOutlineTeam}
          label="Nhân viên"
          value={employees?.length}
          bgColor="bg-orange-500"
        />
      </div>
    </div>
  );
};

export default Statistics;
