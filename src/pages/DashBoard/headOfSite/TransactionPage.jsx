import {
  SyncOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Table,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import StatusLabel from "../../../components/StatusLabel";

import {
  getOrderByCondition,
  getOrderByDepartmentId,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";
import { getDepartmentById } from "../../../repository/department/department";

const TransactionPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("outgoing orders");
  const [currentDepInfo, setCurrentDepInfo] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const { RangePicker } = DatePicker;
  useEffect(() => {
    const fetchCurrentDepInfo = async () => {
      const res = await getDepartmentById(currentUser.workDepartment._id);
      if (res?.status === 200) {
        setCurrentDepInfo(res.data.data.gatherPoint);
      }
    };
    fetchCurrentDepInfo();
  }, []);
  console.log('current depart', currentDepInfo);

  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByDepId = async (depId) => {
      setIsLoading(true);
      const res = await getOrderByDepartmentId(depId);
      console.log('fetch order res', res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };
    if (filterValue === "outgoing orders") {
      fetchOrderByDepId(currentUser.workDepartment._id);
    }
  }, [
    filterValue,
    currentUser.workDepartment._id,
    isReloading,
  ]);

  console.log('all order', allOrders);

  // Fetch orders based on filter value
  useEffect(() => {
    const fetchOrderByTransactionDep = async (data) => {
      setIsLoading(true);
      const res = await getOrderByCondition(data);
      console.log('fetch order by depart', res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };
    if (filterValue === "incoming orders") {
      const data = {
        condition: {
          next_department: currentUser.workDepartment._id,
          status: "processing",
        },
      };
      fetchOrderByTransactionDep(data);
    }
  }, [filterValue, currentUser.workDepartment._id, isReloading]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderCode",
      render: value => {
        return <>{value}</>
      }
    },
    {
      title: "Người gửi",
      dataIndex: "sender",
      key: "senderName",
      width: "14%",
      filteredValue: [searchValue],
      onFilter: (value, record) =>
        String(record.sender).toLowerCase().includes(value.toLowerCase()) ||
        String(record.receiver).toLowerCase().includes(value.toLowerCase()) ||
        String(record._id).toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "receiverName",
      width: "14%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return <StatusLabel status={value} />;
      },
      width: "20%",
    },

    {
      title: "Ngày gửi hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return <div>{new Date(value).toLocaleDateString("vi-VN")}</div>;
      },
      width: "16%",
    },
  ];

  // Handle date
  const handleDateChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  return (
    <>
      <div className="w-full h-full">
        <div className="w-full p-3 flex items-center">
          <div className="w-full flex items-center gap-x-3">
            <p className="font-semibold text-xl text-[#266191]">Bộ lọc</p>
            <Form
              form={form}
              initialValues={{
                filterValue: "new orders",
              }}
            >
              <Form.Item noStyle className="w-full" name="filterValue">
                <Select
                  onChange={(value) => setFilterValue(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "new orders",
                      label: "Đơn hàng mới nhận",
                    },
                    {
                      value: "success orders",
                      label: "Đơn hàng giao thành công",
                    },
                    {
                      value: "sending orders",
                      label: "Đơn hàng đang chuyển đi",
                    },
                    {
                      value: "failed orders",
                      label: "Đơn hàng chuyển đi thất bại",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item noStyle className="w-full" name="dateFilter">
                <RangePicker onChange={handleDateChange}/>
              </Form.Item>
            </Form>
          </div>
          <Input.Search
            className="max-w-[42%] w-full"
            size="large"
            placeholder="Nhập mã đơn hàng, tên người gửi, người nhận"
            onSearch={(value) => setSearchValue(value)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Table
          loading={isLoading}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          title={() => (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  onClick={() => setIsReloading(!isReloading)}
                  className="mr-3 cursor-pointer p-2 hover:bg-neutral-200 rounded-full flex items-center"
                >
                  <SyncOutlined spin={isReloading} className="text-[18px]" />
                </span>
                <h2 className="font-semibold h-full">Danh sách đơn hàng</h2>
              </div>
            </div>
          )}
        />
        
      </div>
    </>
  );
};

export default TransactionPage;
