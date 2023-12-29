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

import { NavLink } from "react-router-dom";

import {
  getOrderByCondition,
  updateOrder,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";
import { getDepartmentById } from "../../../repository/department/department";

import moment from "moment";
import StatusLabel from "../../StatusLabel";

const GatheringOrderTable = () => {
  const { RangePicker } = DatePicker;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("incoming orders");
  const [ordersData, setOrdersData] = useState([]);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [currentDepInfo, setCurrentDepInfo] = useState({});
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchCurrentDepInfo = async () => {
      const res = await getDepartmentById(currentUser.workDepartment._id);
      if (res?.status === 200) {
        setCurrentDepInfo(res.data.gatherPoint);
      }
    };
    fetchCurrentDepInfo();
  }, []);
  console.log("selectedRows: ", selectedRows);

  // Handle format selected orders to send to server
  const handleFormatConfirmOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "processing" &&
        order.next_department._id === currentUser.workDepartment._id
      ) {
        return {
          orderId: order._id,
          current_department: currentUser.workDepartment._id,
          description: `Đơn hàng đã đến ${currentUser.workDepartment.name}`,
        };
      }
    });
    return {
      type: "confirm",
      orders: [...formattedOrders],
    };
  };

  const handleFormatTransferOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        (order.status === "accepted" &&
          order.current_department._id === currentUser.workDepartment._id) ||
        (order.status === "rejected" &&
          order.current_department._id === currentUser.workDepartment._id)
      ) {
        return {
          orderId: order._id,
          next_department: order.next_department._id || order.next_department,
          description: `Đơn hàng đang đến ${
            order.next_department.name || order.description
          }`,
        };
      }
    });
    return {
      type: "transfer",
      orders: [...formattedOrders],
    };
  };

  const handleFormatRejectOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "processing" &&
        order.next_department._id === currentUser.workDepartment._id
      ) {
        return {
          orderId: order._id,
          description: `Đơn hàng giao đến ${currentUser.workDepartment.name} thất bại`,
        };
      }
    });
    return {
      type: "reject",
      orders: [...formattedOrders],
    };
  };

  // Handle when user clicks confirm button
  const handleOnConfirm = async () => {
    // setIsLoading(true);
    if (filterValue === "incoming orders") {
      const ordersData = handleFormatConfirmOrders(selectedRows);
      setOrdersData(ordersData.orders);
      console.log(ordersData);
      if (ordersData.orders.length > 0 && ordersData.type === "confirm") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated(!isOrderUpdated);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
    } else if (filterValue === "outgoing orders") {
      const ordersData = handleFormatTransferOrders(selectedRows);
      setOrdersData(ordersData.orders);
      if (ordersData.orders.length > 0 && ordersData.type === "transfer") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res?.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated(!isOrderUpdated);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
      console.log(ordersData);
    }
  };

  // Handle when user clicks reject button
  const handleOnReject = async () => {
    setIsLoading(true);
    const ordersData = handleFormatRejectOrders(selectedRows);
    console.log(ordersData);
    if (ordersData.orders.length > 0 && ordersData.type === "reject") {
      const res = await updateOrder(ordersData);
      console.log("update order: ", res);
      if (res?.status === 200) {
        messageApi.success("Từ chối đơn hàng thành công");
        setIsLoading(false);
        setIsOrderUpdated(!isOrderUpdated);
      } else {
        messageApi.error("Từ chối đơn hàng thất bại");
        setIsLoading(false);
      }
    }
  };

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

    if (filterValue === "incoming orders") {
      const data = {
        condition: {
          next_department: currentUser.workDepartment._id,
          status: "processing",
        },
      };
      fetchOrderByGatheringDep(data);
    } else if (filterValue === "outgoing orders") {
      const data = {
        condition: {
          current_department: currentUser.workDepartment._id,
        },
      };
      fetchOrderByGatheringDep(data);
    }
  }, [
    currentUser?.workDepartment?._id,
    messageApi,
    isOrderUpdated,
    filterValue,
    isReloading,
  ]);

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
            <NavLink to={`/employee/order-detail/${record._id}`}>
              {value}
            </NavLink>
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // New selected rows after onChange event
      const newSelectedRows = selectedRows;
      console.log("fafef", selectedRows);
      setSelectedRows((prevSelectedRows) => {
        // Find the rows that were not previously selected
        const addedRows = newSelectedRows.filter(
          (newRow) =>
            !prevSelectedRows.some((oldRow) => oldRow._id === newRow._id)
        );

        // Find the rows that were previously selected but are not selected now
        const removedRows = prevSelectedRows.filter(
          (oldRow) =>
            !newSelectedRows.some((newRow) => oldRow._id === newRow._id)
        );

        console.log("removedRows", removedRows);
        // Return the new selected rows, excluding the removed rows
        return prevSelectedRows
          .concat(addedRows)
          .filter((row) => !removedRows.includes(row));
      });
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRows.length > 0) {
        setIsRowSelected(true);
      } else {
        setIsRowSelected(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
      }
    },
    getCheckboxProps: (record) => ({
      // Disable check box when order is processing and being transported to another department
      disabled:
        record.status === "processing" &&
        record.next_department !== currentUser.workDepartment._id &&
        filterValue === "outgoing orders" &&
        record.next_department !== null,

      // Column configuration not to be checked
      status: record.status,
    }),
  };
  console.log(dates);
  return (
    <>
      {contextHolder}
      <div className="w-full h-full">
        <div className="w-full p-3 flex items-center justify-between">
          <div className="w-full flex items-center gap-x-3">
            <p className="font-semibold text-xl text-[#266191]">Bộ lọc</p>
            <Form
              form={form}
              initialValues={{
                filterValue: "incoming orders",
              }}
            >
              <Form.Item noStyle className="w-full" name="filterValue">
                <Select
                  onChange={(value) => setFilterValue(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "incoming orders",
                      label: "Đơn đang đến",
                    },
                    {
                      value: "outgoing orders",
                      label: "Đơn chuyển tiếp",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </div>

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
          rowSelection={{
            ...rowSelection,
            selectedRowKeys,
          }}
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
                <h2 className="font-semibold h-full">Danh sách đơn hàng</h2>
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
                      console.log(formattedDates);
                      setDates(formattedDates);
                    }
                  }}
                />
              </div>
            </div>
          )}
        />

        <div className="w-full flex items-center justify-between my-6">
          <p className="font-semibold text-xl text-[#266191] bg-neutral-200 p-2 rounded-lg">
            Đã chọn:{" "}
            <span className="text-orange-600">
              {selectedRows.length}/{allOrders.length}
            </span>
          </p>
          <div className="flex items-center gap-x-3">
            {filterValue === "incoming orders" && (
              <Button
                // loading={isLoading}
                onClick={handleOnReject}
                htmlType="submit"
                className="float-right"
                type="primary"
                danger
                disabled={
                  !isRowSelected ||
                  selectedRows
                    .map((item) => item?.next_department)
                    .includes(null)
                }
                size="large"
              >
                Từ chối
              </Button>
            )}

            <Button
              loading={isLoading && ordersData.type === "confirm"}
              onClick={handleOnConfirm}
              htmlType="submit"
              className="float-right"
              type="primary"
              disabled={
                !isRowSelected ||
                selectedRows.map((item) => item?.next_department).includes(null)
              }
              size="large"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GatheringOrderTable;
