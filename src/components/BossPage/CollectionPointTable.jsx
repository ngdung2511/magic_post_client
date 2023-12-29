import { Button, Input, Popconfirm, Table, message } from "antd";

import { useEffect, useState } from "react";

import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import AddSiteModal from "./AddSiteModal";
import { NavLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/hook";
import { deleteDepartment } from "../../repository/department/department";

const CollectionPointTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, []);
  const departments = useStoreState((state) => state.departments);

  // Handle delete department
  const handleDelete = async (departmentId) => {
    setIsLoading(true);
    try {
      const deleteDepRes = await deleteDepartment(departmentId);
      // const deleteUserRes = await deleteUserById(departmentId);

      if (deleteDepRes.status === 200) {
        messageApi.success("Xóa thành công");
        setIsLoading(false);
        fetchDepartments();
      }
    } catch (error) {
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
          <NavLink to={`/boss/manage-sites/${record._id}`}>{value}</NavLink>
        );
      },
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        String(record.name).toLowerCase().includes(value.toLowerCase()) ||
        String(record.address).toLowerCase().includes(value.toLowerCase()) ||
        String(record._id).toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "3%",
      render: (value) => {
        return <span className="text-orange-500 font-semibold">{value}</span>;
      },
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
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10 }}
          title={() => (
            <div className="flex items-center justify-between">
              <h2 className="font-semibold w-full">
                Điểm Giao dịch và Tập kết
              </h2>

              <div className="flex justify-between w-full gap-6">
                <Input
                  allowClear
                  className="w-full"
                  prefix={<SearchOutlined />}
                  size="large"
                  placeholder="Tìm kiếm theo tên hoặc địa chỉ điểm"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />

                <Button
                  onClick={() => setIsModalOpen(true)}
                  icon={<PlusOutlined />}
                  type="primary"
                  size="large"
                >
                  Thêm điểm
                </Button>
              </div>
            </div>
          )}
        />
        <AddSiteModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </>
  );
};

export default CollectionPointTable;
