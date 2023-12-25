import {
    Button,
    Input,
    Popconfirm,
    Space,
    Table,
    Typography,
    message,
  } from "antd";
  
  import { useEffect, useRef, useState } from "react";
  
  import {
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
  } from "@ant-design/icons";
  import Highlighter from "react-highlight-words";
  import AddSiteModal from "./AddSiteModal";
  import { NavLink } from "react-router-dom";
  import { useStoreActions, useStoreState } from "../../store/hook";
  import { deleteDepartment } from "../../repository/department/department";
  import { deleteUserById } from "../../repository/user/user";
import { getOrderByCondition } from "../../repository/order/order";
import Statistic from "antd/es/statistic/Statistic";
  
  const PointList = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    // Get all departments from API
    const fetchDepartments = useStoreActions(
      (actions) => actions.fetchDepartments
    );

    const fetchOrdersNumber = async () => {
        try {
          const res = await getOrderByCondition({});
          setOrderCount(res.data.numbers);
        } catch (error) {
          // Handle error
          console.error("Error fetching orders:", error);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
          await fetchDepartments();
          await fetchOrdersNumber();
        };
      
        fetchData();
      }, []);
      
    const departments = useStoreState((state) => state.departments);
  
    // Handle search in table
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    }; 

    // Handle delete department
    const handleDelete = async (departmentId) => {
      setIsLoading(true);
      try {
        const deleteDepRes = await deleteDepartment(departmentId);
        // const deleteUserRes = await deleteUserById(departmentId);
        // console.log(res);
        if (deleteDepRes.status === 200) {
          messageApi.success("Xóa thành công");
          setIsLoading(false);
          fetchDepartments();
        }
      } catch (error) {
        // console.log(error);
        messageApi.error("Đã có lỗi xảy ra");
      }
    };
     
    const columns = [
      {
        title: "ID",
        dataIndex: "_id",
        width: "3%",
        className: "font-bold",
      },
      {
        title: "Tên điểm",
        dataIndex: "name",
        width: "3%",
        render: (value, record) => {
          return (
            <NavLink to={`/boss/order-list/${record._id}`}>{value}</NavLink>
          );
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
  
        width: "3%",
      },
      {
        title: "Phân loại",
  
        dataIndex: "type",
        render: (value) => {
          return <span>{value === "Gathering" ? "Tập kết" : "Giao dịch"}</span>;
        },
        filters: [
          {
            text: "Giao dịch",
            value: "Transaction",
          },
          {
            text: "Tập kết",
            value: "Gathering",
          },
        ],
        onFilter: (value, record) => record.type.startsWith(value),
        // filterSearch: true,
        width: "2%",
      },
      {
        className: "text-center",
        render: (_, record) => {
          return (
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
          );
        },
        width: "1%",
        fixed: "right",
      },
    ];
    return (
      <>
        {contextHolder}
        <div className="w-full h-full py-4">
          <Table
            rowKey={(row) => row._id}
            columns={columns}
            dataSource={departments}
            bordered
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 10 }}
            title={() => (
              <div className="flex items-center justify-between ">
                <Typography.Title className="mb-0" level={3}>
                    Danh sách điểm
                </Typography.Title>
                
                <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Đơn hàng"
              value={orderCount}
              className="mr-12"
            />
              </div>
            )}
          />
        </div>
      </>
    );
  };
  
  export default PointList;
  