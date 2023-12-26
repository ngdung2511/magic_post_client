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
import moment from "moment";

const GatheringPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("send");
  const [isReloading, setIsReloading] = useState(false);
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);

  // Fetch orders based on filter value
  useEffect(() => {
    const fetchOrderWithCondition = async (condition) => {
      setIsLoading(true);
      const res = await getOrderByCondition(condition);
      console.log('fetch order by depart', res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };

    const filter = {
      condition: {}
    };
    //location [send, receive, current, next]
    if (locationFilter === "current") {
      filter.condition.current_department = currentUser.workDepartment._id;
    } else if (locationFilter === "next") {
      filter.condition.next_department = currentUser.workDepartment._id;
    } 
    fetchOrderWithCondition(filter)
  }, [locationFilter, currentUser.workDepartment._id, isReloading]);

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
      title: "Điểm gửi hàng",
      dataIndex: "send_department",
      key: "sendDepartment",
      render: (value) => {
        return <div>{value.name}</div>;
      },
      width: "14%",
    },
    {
      title: "Điểm đến tiếp theo",
      dataIndex: "next_department",
      key: "nextDepartment",
      render: (value) => {
        return <div>{value.name}</div>;
      },
      width: "14%",
    },
    {
      title: "Điểm nhận hàng",
      dataIndex: "receive_department",
      key: "receiveDepartment",
      render: (value) => {
        return <div>{value.name}</div>;
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
      filteredValue: [statusFilter],
      onFilter: (value, record) => {
        if (value === "all") {
          return true;
        }
        return String(record.status) === value;
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
      filteredValue: [dates],
      onFilter: (value, record) => {
        if(dates.length > 0){
          return moment(record.createdAt).isBetween(dates[0], dates[1], undefined, '[]');
        } else {
          return record;
        }
      },
      width: "16%",
    }, 
  ];

  // Handle date
  const handleDateChange = (value, dateString) => {
    setMinDate(dateString[0]);
    setMaxDate(dateString[1]);
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
                statusFilter: "all",
              }}
            >
              <Form.Item noStyle className="w-full" name="statusFilter">
                <Select
                  onChange={(value) => setStatusFilter(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "all",
                      label: "Tất cả",
                    },
                    {
                      value: "accepted",
                      label: "Đã xác nhận",
                    },
                    {
                      value: "delivered",
                      label: "Đã giao",
                    },
                    {
                      value: "processing",
                      label: "Chờ xác nhận",
                    },
                    {
                      value: "rejected",
                      label: "Chuyển tiếp thất bại",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
            <Form
              form={form}
              initialValues={{
                locationFilter: "current",
              }}
            >
              <Form.Item noStyle className="w-full" name="locationFilter">
                <Select
                  onChange={(value) => setLocationFilter(value)}
                  size="large"
                  options={[
                    {
                      value: "next",
                      label: "Săp nhận tại điểm này",
                    },
                    {
                      value: "current",
                      label: "Đang ở điểm này",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
            <div className="xl:w-[30%] w-[60%] md:w-[40%]">
              <RangePicker
                  className="w-full"
                  size="large"
                  format={"DD/MM/YYYY"}
                  onChange={(value, dateString) => {
                    if (value === null) {
                      return setDates([]);
                    } else {
                      const formatDates = value.map((date) => {
                        return moment(date.$d, 'DD/MM/YYYY');
                      });
                      setDates(formatDates);
                    }
                  }}
                />
              </div>
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

export default GatheringPage;
