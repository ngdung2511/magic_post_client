import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Tooltip,
  DatePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import StatusLabel from "../StatusLabel";

import moment from "moment";
import { getDepartmentById } from "../../repository/department/department";
import { getOrderByCondition } from "../../repository/order/order";

const GatheringOrderTable = () => {
  const { RangePicker } = DatePicker;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("incoming orders");
  const [ordersData, setOrdersData] = useState([]);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [currentDepInfo, setCurrentDepInfo] = useState({});
  const [dates, setDates] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  useEffect(() => {
    const fetchCurrentDepInfo = async () => {
      const res = await getDepartmentById(id);
      if (res?.status === 200) {
        setCurrentDepInfo(res.data.gatherPoint);
      }
    };
    fetchCurrentDepInfo();
  }, []);

  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByGatheringDep = async (data) => {
      setIsLoading(true);
      const res = await getOrderByCondition(data);

      if (res?.status === 200) {
        setIsLoading(false);
        setIsReloading(false);
        setAllOrders(res.data.orders);
        setIsRowSelected(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
      } else {
        setIsLoading(false);
        setIsReloading(false);
        messageApi.error("Lấy danh sách đơn hàng thất bại");
      }
    };

    const data = {
      condition: {
        current_department: id,
      },
    };
    fetchOrderByGatheringDep(data);
  }, [id, messageApi, isOrderUpdated, isReloading]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderCode",
      render: (value, record) => {
        return (
          <Tooltip
            title={
              // Check if order is rejected and is in transit to linked department
              record.status === "rejected" &&
              record.next_department._id ===
                currentDepInfo?.linkDepartments[0]?.departmentId &&
              "Chọn đơn để giao lại!"
            }
          >
            <a onClick={() => navigate(`/boss/order-detail/${record._id}`)}>
              {value}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: "Điểm tiếp theo",
      dataIndex: "next_department",
      key: "nextDepartment",
      render: (data) => {
        return (
          <div className="text-orange-600 font-semibold">
            {data?.name || (
              <span className="text-gray-600">Chưa chọn điểm</span>
            )}
          </div>
        );
      },
      width: "16%",
    },
    {
      title: "Người gửi",
      dataIndex: "sender",
      key: "senderName",
      width: "17%",
      filteredValue: [searchValue],
      onFilter: (value, record) =>
        String(record.sender).toLowerCase().includes(value.toLowerCase()) ||
        String(record.receiver).toLowerCase().includes(value.toLowerCase()) ||
        String(record._id).toLowerCase().includes(value.toLowerCase()),
      render: (value, record) => {
        return (
          <div>
            <p className="font-semibold text-blue-800">{value}</p>
            <p className="text-sm text-gray-800">
              {record?.senderPhone} - {record?.send_department.name}
            </p>
          </div>
        );
      },
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "receiverName",
      width: "17%",
      render: (value, record) => {
        return (
          <div>
            <p className="font-semibold text-blue-800">{value}</p>
            <p className="text-sm text-gray-800">
              {record.senderPhone} - {record.receive_department.name}
            </p>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return <StatusLabel status={value} />;
      },
      width: "14%",
    },
    {
      title: "Ngày gửi hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return <div>{new Date(value).toLocaleDateString("vi-VN")}</div>;
      },
      filteredValue: [dates],
      onFilter: (value, record) => {
        if (dates.length > 0) {
          return moment(record.createdAt).isBetween(
            dates[0],
            dates[1],
            undefined,
            "[]"
          );
        } else return record;
      },
      width: "16%",
    },
    {
      title: "Ngày giao hàng dự kiến",
      dataIndex: "expectedDate",
      key: "expectedDate",
      render: (value) => {
        return <div>{new Date(value).toLocaleDateString("vi-VN")}</div>;
      },
      filteredValue: [dates],
      onFilter: (value, record) => {
        if (dates.length > 0) {
          return moment(record.createdAt).isBetween(
            dates[0],
            dates[1],
            undefined,
            "[]"
          );
        } else return record;
      },
      width: "16%",
    },
  ];

  // Handle format linked departments so they don't include send department of order
  const linkedDepOptions = (sendDepId) => {
    const res = currentDepInfo.linkDepartments
      ?.filter((item) => item.departmentId !== sendDepId)
      .map((dep) => {
        return {
          value: dep.departmentId,
          label: dep.name,
        };
      });
    return res;
  };

  if (filterValue === "outgoing orders") {
    columns.splice(1, 0, {
      title: "Điểm đến tiếp theo",
      dataIndex: "newData",
      key: "nextDepartment",
      width: "16%",
      render: (value, record) => {
        return (
          <Form>
            <Form.Item noStyle>
              <Select
                className="w-full"
                disabled={
                  !selectedRows.map((order) => order._id).includes(record._id)
                }
                onSelect={(selectedNextDep) => {
                  console.log(selectedNextDep);

                  const tmp = linkedDepOptions(record.send_department._id);
                  const des = tmp.find(
                    (item) => item.value === selectedNextDep
                  ).label;

                  // Add next department to each order when user selects from input
                  setSelectedRows((prevSelectedRows) => {
                    console.log(prevSelectedRows);
                    return prevSelectedRows.map((order) =>
                      order._id === record._id
                        ? {
                            ...order,
                            next_department: selectedNextDep,
                            description: des,
                          }
                        : order
                    );
                  });
                }}
                size="large"
                options={linkedDepOptions(record.send_department._id)}
                placeholder={
                  record.next_department?.name || "Chọn điểm chuyển tiếp"
                }
              />
            </Form.Item>
          </Form>
        );
      },
    });
  }

  // Handle select rows of orders in table

  console.log(dates);
  return (
    <>
      {contextHolder}
      <div className="w-full h-full">
        <div className="w-full p-3 flex items-center justify-between">
          <div className="w-[60%]">
            <Input.Search
              className="w-full"
              size="large"
              placeholder="Nhập mã đơn hàng, tên người gửi, người nhận"
              onSearch={(value) => setSearchValue(value)}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <Table
          loading={isLoading}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1600 }}
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
                <h2 className="font-semibold h-full">
                  Điểm{" "}
                  {currentDepInfo.type === "Gathering"
                    ? "Tập kết"
                    : "Giao dịch"}{" "}
                  {currentDepInfo.name}
                </h2>
              </div>
              <div className="xl:w-[30%] w-[60%] md:w-[40%]">
                <RangePicker
                  className="w-full"
                  size="large"
                  format={"DD/MM/YYYY"}
                  onChange={(value, dateString) => {
                    console.log(value, dateString);
                    if (value === null) return setDates([]);
                    else {
                      const formattedDates = value.map((date) => {
                        return moment(date.$d, "DD/MM/YYYY");
                      });

                      setDates(formattedDates);
                    }
                  }}
                />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default GatheringOrderTable;
