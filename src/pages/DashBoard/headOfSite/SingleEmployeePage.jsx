import {
    EditOutlined,
    LeftOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
  } from "@ant-design/icons";
  import { Button, Card, Descriptions, Divider, Spin, Statistic } from "antd";
  import { useEffect, useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import EditEmployeeModal from "../../../components/HeadOfSite/EditEmployeeModal";
  import { useStoreActions, useStoreState } from "../../../store/hook";
  
  const SingleEmployeePage = () => {
    const { id: employeeId } = useParams();
    const [isOpenEditEmployeeModal, setIsOpenEditEmployeeModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    console.log("employee: ", currentEmployee);
    // Get department by id
    const fetchUserById = useStoreActions(
      (actions) => actions.fetchUserById
    );
    useEffect(() => {
      async function fetchData() {
        const res = await fetchUserById(employeeId);
        setCurrentEmployee(res.user);
      }
      fetchData();
    }, [employeeId, fetchUserById]);
  
    // Get all departments from API
    const fetchDepartments = useStoreActions(
      (actions) => actions.fetchDepartments
    );
    useEffect(() => {
      fetchDepartments();
    }, []);
    const departments = useStoreState((state) => state.departments);
    if (!currentEmployee)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin />
      </div>
    );
    const employeeInfo = [
      {
        key: "1",
        label: "Tên",
        children: currentEmployee.name,
      },
      {
        key: "2",
        label: "Chức vụ",
        children: currentEmployee.role === "gatheringStaff" ? "Nhân viên tập kết" : "Nhân viên giao dịch",
      },
      {
        key: "3",
        label: "Địa chỉ",
        children: currentEmployee.address,
      },
      {
        key: "4",
        label: "Số điện thoại",
        children: currentEmployee.phone,
      },
      {
        key: "5",
        label: "Email",
        children: currentEmployee.email,
      },
      {
        key: "6",
        label: "Phòng ban",
        children: currentEmployee.department,
      }
    ];
  
    return (
      <div className="w-full h-full">
        <div className="flex items-center w-full">
          <Link
            to="/head/manage-accounts"
            className="p-2 text-black hover:text-black"
          >
            <LeftOutlined className="text-md hover:text-neutral-500" />
          </Link>
          <Divider type="vertical" />
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-md">
              
            </h1>
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={() => setIsOpenEditEmployeeModal(true)}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
        <Divider />
        <div className="w-full">
          <div>
            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                  <Statistic
                    
                    title={
                      <p className="text-lg font-medium text-neutral-600">
                        Chức vụ
                      </p>
                    }
                    value={currentEmployee?.role === "gatheringStaff" ? "Nhân viên tập kết" : "Nhân viên giao dịch"}
                  />
                </Card>
                <Card>
                  <Statistic
                    prefix={
                      <ShoppingCartOutlined
                        size={20}
                        className="p-2 text-white bg-orange-500 rounded-full"
                      />
                    }
                    title={
                      <p className="text-lg font-medium text-neutral-600">
                        Đơn hàng đã hoàn thành
                      </p>
                    }
                    value={112893}
                  />
                </Card>
              </div>
            </div>
            <div className="mt-[12px]">
              <Descriptions
                title={<h2 className="font-semibold">Thông tin chi tiết</h2>}
                layout="vertical"
                bordered
                items={employeeInfo}
              />
            </div>
  
            <EditEmployeeModal
              currentEmployee={currentEmployee}
              isOpenEditEmployeeModal={isOpenEditEmployeeModal}
              setIsOpenEditEmployeeModal={setIsOpenEditEmployeeModal}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default SingleEmployeePage;
  