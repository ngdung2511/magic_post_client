import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import CreateOrderModal from "./CreateOrderModal";
import { NavLink } from "react-router-dom";
import StatusLabel from "../../StatusLabel";

import {
  deleteOrder,
  getOrderByCondition,
  getOrderByDepartmentId,
  updateOrder,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";
import { getDepartmentById } from "../../../repository/department/department";
import moment from "moment";
import { orderStatusOptions } from "../../../shared/commonData";

const TransactionOrderTable = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [isNewOrderCreated, setIsNewOrderCreated] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("outgoing orders");
  const [currentDepInfo, setCurrentDepInfo] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [dates, setDates] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  useEffect(() => {
    const fetchCurrentDepInfo = async () => {
      const res = await getDepartmentById(currentUser.workDepartment._id);
      if (res?.status === 200) {
        setCurrentDepInfo(res.data.gatherPoint);
      }
    };
    fetchCurrentDepInfo();
  }, []);
  console.log(currentDepInfo);

  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByDepId = async (depId) => {
      setIsLoading(true);
      const res = await getOrderByDepartmentId(depId);
      console.log(res);
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
    isNewOrderCreated,
    isOrderUpdated,
    isReloading,
  ]);

  console.log(allOrders);

  // Fetch orders based on filter value
  useEffect(() => {
    const fetchOrderByTransactionDep = async (data) => {
      setIsLoading(true);
      const res = await getOrderByCondition(data);
      console.log(res);
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
    } else if (filterValue === "at destination") {
      const data = {
        condition: {
          current_department: currentUser.workDepartment._id,
          receive_department: currentUser.workDepartment._id,
        },
      };
      fetchOrderByTransactionDep(data);
    }
  }, [
    filterValue,
    currentUser.workDepartment._id,
    isReloading,
    isOrderUpdated,
  ]);

  // Handle format selected orders to send to server
  const handleFormatResendOrder = (selectedRows) => {
    console.log(selectedRows);
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "rejected" &&
        order.next_department._id ===
          currentDepInfo?.linkDepartments[0]?.departmentId
      ) {
        return {
          orderId: order._id,
          description: `Đơn hàng đang đến ${currentDepInfo?.linkDepartments[0]?.name}`,
        };
      }
    });
    return {
      type: "resend",
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
      } else if (
        order.status === "accepted" &&
        order.receive_department._id === order.current_department._id
      ) {
        return {
          orderId: order._id,
          description: `Đơn hàng giao đến bạn thất bại. Đang giao lại!`,
        };
      }
    });
    return {
      type: "reject",
      orders: [...formattedOrders],
    };
  };
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

  const handleFormatDeliveredOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "accepted" ||
        (order.status === "rejected" &&
          order.current_department._id === order.receive_department._id)
      ) {
        return {
          orderId: order._id,
          description: `Đơn hàng đã được giao thành công`,
        };
      }
    });
    return {
      type: "delivered",
      orders: [...formattedOrders],
    };
  };
  const handleOnConfirm = async () => {
    // setIsLoading(true);

    if (filterValue === "outgoing orders") {
      const ordersData = handleFormatResendOrder(selectedRows);
      setOrdersData(ordersData.orders);
      console.log(ordersData);
      if (ordersData.orders.length > 0 && ordersData.type === "resend") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res?.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated((prevState) => !prevState);
          setIsRowSelected(false);
          setSelectedRows([]);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
    } else if (filterValue === "incoming orders") {
      const ordersData = handleFormatConfirmOrders(selectedRows);
      setOrdersData(ordersData.orders);
      if (ordersData.orders.length > 0 && ordersData.type === "confirm") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res?.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated((prevState) => !prevState);
          setIsRowSelected(false);
          setSelectedRows([]);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
      console.log(ordersData);
    } else if (filterValue === "at destination") {
      const ordersData = handleFormatDeliveredOrders(selectedRows);
      setOrdersData(ordersData.orders);
      if (ordersData.orders.length > 0 && ordersData.type === "delivered") {
        console.log(ordersData);
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res?.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated((prevState) => !prevState);
          setIsRowSelected(false);
          setSelectedRows([]);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
    }
  };

  // Handle when user clicks reject button
  const handleOnReject = async () => {
    // setIsLoading(true);
    const ordersData = handleFormatRejectOrders(selectedRows);
    console.log(ordersData);
    if (ordersData.orders.length > 0 && ordersData.type === "reject") {
      console.log(ordersData);
      const res = await updateOrder(ordersData);
      console.log("update order: ", res);
      if (res?.status === 200) {
        messageApi.success("Từ chối đơn hàng thành công");
        setIsLoading(false);
        setIsOrderUpdated((prevState) => !prevState);
        setIsRowSelected(false);
        setSelectedRows([]);
      } else {
        messageApi.error("Từ chối đơn hàng thất bại");
        setIsLoading(false);
      }
    }
  };

  // Handle delete order
  const handleDelete = async (orderId) => {
    setIsLoading(true);
    const res = await deleteOrder(orderId);
    if (res.status === 200) {
      messageApi.success("Xóa đơn hàng thành công");
      setIsLoading(false);
      const fetchOrderByDepId = async (depId) => {
        const res = await getOrderByDepartmentId(depId);

        console.log(res);
        if (res?.status === 200) {
          setAllOrders(res.data.orders);
        }
      };
      fetchOrderByDepId(currentUser.workDepartment._id);
    } else {
      setIsLoading(false);
      messageApi.error("Xóa đơn hàng thất bại");
    }
    console.log(orderId);
  };
  const handleChange = (pagination, filters, sorter) => {
    console.log(filters);
    setFilteredInfo(filters);
  };
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
              record?.status === "rejected" &&
              record?.next_department?._id ===
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
              {record?.senderPhone} - {record?.receive_department.name}
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
      width: "20%",
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      filters: orderStatusOptions,
    },

    {
      title: "Ngày gửi hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return <div>{new Date(value).toLocaleDateString("vi-VN")}</div>;
      },
      width: "14%",
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
    },
    {
      key: "action",
      render: (value, record) => (
        <div
          className={`items-center justify-center ${
            record.send_department._id === currentUser.workDepartment._id
              ? "flex"
              : "hidden"
          }`}
        >
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa dữ liệu này?"
            okType="danger"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
            okButtonProps={{
              loading: isLoading,
            }}
          >
            <span className="text-lg cursor-pointer hover:text-red-600">
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </div>
      ),
      width: "6%",
      fixed: "right",
    },
  ];

  // Handle select rows of orders in table
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setIsRowSelected(true);
        setSelectedRows(selectedRows);
      } else {
        setIsRowSelected(false);
        setSelectedRows([]);
      }
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      // Disable check box when order is processing and being transported to another department
      disabled:
        // Disable orders that are going out from current dep and are processing
        (record.status === "processing" &&
          record?.next_department?._id !== currentDepInfo?._id) ||
        // Disable orders that are rejected and are not in current dep
        (record.status === "rejected" &&
          record?.current_department?._id !== currentDepInfo?._id &&
          filterValue === "at destination") ||
        record.status === "delivered" ||
        // Disable orders that are accepted and are not in current dep
        (record.status === "accepted" &&
          record?.receive_department?._id !== currentUser.workDepartment._id),

      status: record.status,
    }),
  };
  return (
    <>
      {contextHolder}
      <div className="w-full h-full">
        <div className="w-full p-3 flex items-center">
          <div className="w-full flex items-center gap-x-3">
            <p className="font-semibold text-xl text-[#266191]">Bộ lọc</p>
            <Form
              form={form}
              initialValues={{
                filterValue: "outgoing orders",
              }}
            >
              <Form.Item noStyle className="w-full" name="filterValue">
                <Select
                  onChange={(value) => setFilterValue(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "outgoing orders",
                      label: "Đơn gửi từ điểm",
                    },
                    {
                      value: "incoming orders",
                      label: "Đơn đang đến",
                    },
                    {
                      value: "at destination",
                      label: "Đơn nhận tại điểm",
                    },
                  ]}
                />
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
          onChange={handleChange}
          loading={isLoading}
          rowSelection={{
            ...rowSelection,
          }}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          title={() => (
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center w-full">
                  <span
                    onClick={() => setIsReloading(!isReloading)}
                    className="mr-3 cursor-pointer p-2 hover:bg-neutral-200 rounded-full flex items-center"
                  >
                    <SyncOutlined spin={isReloading} className="text-[18px]" />
                  </span>
                  <h2 className="font-semibold h-full">Danh sách đơn hàng</h2>
                </div>

                <div className="xl:w-[100%]">
                  <DatePicker.RangePicker
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

              <Button
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
                type="primary"
                size="large"
              >
                Tạo đơn
              </Button>
              <CreateOrderModal
                isNewOrderCreated={isNewOrderCreated}
                setIsNewOrderCreated={setIsNewOrderCreated}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          )}
        />
        {/* <TrackingOrderInfo /> */}
        <div className="w-full flex items-center justify-between my-2">
          <p className="font-semibold text-xl text-[#266191] bg-neutral-200 p-2 rounded-lg">
            Đã chọn:{" "}
            <span className="text-orange-600">
              {selectedRows.length}/{allOrders.length}
            </span>
          </p>
          <div className="flex items-center gap-x-3">
            {(filterValue === "incoming orders" ||
              filterValue === "at destination") && (
              <Button
                // loading={isLoading}
                onClick={handleOnReject}
                htmlType="submit"
                className="float-right"
                type="primary"
                danger
                disabled={
                  !isRowSelected ||
                  // Disable reject button when selected orders are at current dep and status is rejected
                  (selectedRows.some((row) => row.status === "rejected") &&
                    filterValue === "at destination")
                }
                size="large"
              >
                {filterValue === "at destination" ? "Giao thất bại" : "Từ chối"}
              </Button>
            )}
            <Button
              // loading={isLoading}
              onClick={handleOnConfirm}
              htmlType="submit"
              className="float-right"
              type="primary"
              disabled={!isRowSelected}
              size="large"
            >
              {filterValue === "at destination"
                ? "Giao thành công"
                : "Xác nhận"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionOrderTable;
