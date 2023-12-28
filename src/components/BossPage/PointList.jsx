import { Form, Input, Popconfirm, Table, Typography, message } from "antd";

import { useEffect, useState } from "react";

import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";

import Highlighter from "react-highlight-words";

import { NavLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/hook";
import { deleteDepartment } from "../../repository/department/department";

const PointList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchDepartments();
    };

    fetchData();
  }, []);

  const departments = useStoreState((state) => state.departments);

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
        return <NavLink to={`/boss/order-list/${record._id}`}>{value}</NavLink>;
      },
      filteredValue: [searchValue],
      onFilter: (value, record) =>
        String(record.name.toLowerCase()).includes(value.toLowerCase()),

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
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Danh sách các điểm</h2>
              <Form.Item noStyle className="w-full">
                <Input
                  className="w-[30%]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  size="large"
                  placeholder="Tìm kiếm"
                  prefix={<SearchOutlined />}
                  // onChange={handleSearch}
                  allowClear
                />
              </Form.Item>

            </div>
          )}
        />
      </div>
    </>
  );
};

export default PointList;
