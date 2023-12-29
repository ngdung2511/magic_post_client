import { SyncOutlined } from "@ant-design/icons";
import { Form, Input, Select, Table, DatePicker } from "antd";
import { useEffect, useState } from "react";
import StatusLabel from "../../../components/StatusLabel";

import {
  getOrderByCondition,
  getOrderByDepartmentId,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";
import { getDepartmentById } from "../../../repository/department/department";

import moment from "moment";
import { orderStatusOptions } from "../../../shared/commonData";

const TransactionPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [locationFilter, setLocationFilter] = useState("send");
  const [isReloading, setIsReloading] = useState(false);
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  // Fetch orders based on filter value
  useEffect(() => {
    const fetchOrderWithCondition = async (condition) => {
      setIsLoading(true);
      const res = await getOrderByCondition(condition);
      console.log("fetch order by depart", res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };

    const filter = {
      condition: {},
    };
    //location [send, receive, current, next]
    if (locationFilter === "receive") {
      filter.condition.receive_department = currentUser.workDepartment._id;
    } else if (locationFilter === "send") {
      filter.condition.send_department = currentUser.workDepartment._id;
    }
    fetchOrderWithCondition(filter);
  }, [locationFilter, currentUser.workDepartment._id, isReloading]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderCode",
      render: (value) => {
        return <>{value}</>;
      },
    },
    {
      title: "Người gửi",
      dataIndex: "sender",
      key: "senderName",
      width: "20%",
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
      width: "20%",
      render: (value, record) => {
        return (
          <div>
            <p className="font-semibold text-blue-800">{value}</p>
            <p className="text-sm text-gray-800">
              {record?.receiverPhone} - {record?.receive_department.name}
            </p>
          </div>
        );
      },
    },

    {
      title: "Đơn hàng đang ở",
      dataIndex: "current_department",
      key: "currentDepartment",
      render: (value) => {
        return (
          <div className="text-orange-500 font-semibold">{value.name}</div>
        );
      },
      width: "14%",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return <StatusLabel status={value} />;
      },
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      width: "18%",
      filters: orderStatusOptions,
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
        } else {
          return record;
        }
      },
      width: "10%",
    },
  ];

  // Handle date

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full md:p-3 my-3">
          <div className="w-full flex md:items-center flex-col md:flex-row">
            <div className="w-full flex items-center gap-3 mb-3 md:mb-0">
              <p className="font-semibold text-xl text-[#266191] hidden md:block">
                Bộ lọc
              </p>

              <Form
                form={form}
                initialValues={{
                  locationFilter: "send",
                }}
                className="w-full md:w-auto"
              >
                <Form.Item noStyle className="w-full" name="locationFilter">
                  <Select
                    className="w-full md:w-auto"
                    onChange={(value) => setLocationFilter(value)}
                    size="large"
                    options={[
                      {
                        value: "send",
                        label: "Được gửi từ điểm",
                      },
                      {
                        value: "receive",
                        label: "Được nhận tại điểm",
                      },
                    ]}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="w-full flex items-center flex-col md:flex-row gap-3 grow">
              <RangePicker
                className="w-full"
                size="large"
                format={"DD/MM/YYYY"}
                onChange={(value, dateString) => {
                  if (value === null) {
                    return setDates([]);
                  } else {
                    const formatDates = value.map((date) => {
                      return moment(date.$d, "DD/MM/YYYY");
                    });
                    setDates(formatDates);
                  }
                }}
              />
              <Input.Search
                className="w-full"
                size="large"
                placeholder="Nhập mã đơn hàng, tên người gửi, người nhận"
                onSearch={(value) => setSearchValue(value)}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Table
          onChange={(pagination, filters, sorter) => {
            setFilteredInfo(filters);
          }}
          loading={isLoading}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1200 }}
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
