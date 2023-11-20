import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";

import { useRef, useState } from "react";

import { collection_points as data } from "../../mockData/collectionPoint.json";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import AddSiteModal from "./AddSiteModal";
import { NavLink } from "react-router-dom";
console.log(data);
const CollectionPointTable = () => {
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Hủy
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        className="text-lg"
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: "6%",
      className: "text-center font-bold",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên điểm",
      dataIndex: "name",
      width: "20%",
      render: (value, record) => {
        return (
          <NavLink to={`/boss/manage-sites/${record.id}`}>{value}</NavLink>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      filters: [
        {
          text: "Hồ Chí Minh",
          value: "Thành phố Hồ Chí Minh",
          children: [
            {
              text: "Quận 1",
              value: "Quận 1",
            },
          ],
        },
        {
          text: "Hà Nội",
          value: "Thành phố Hà Nội",
        },
      ],

      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        const address = record.address;
        console.log(value, address.split(", "));
        return address.toLowerCase().includes(value.toLowerCase());
      },

      width: "30%",
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      filters: [
        {
          text: "Giao dịch",
          value: "Giao Dịch",
        },
        {
          text: "Tập kết",
          value: "Tập Kết",
        },
      ],
      onFilter: (value, record) => record.type.startsWith(value),
      filterSearch: true,
      width: "10%",
    },
    {
      title: "Trưởng điểm",
      dataIndex: "head_of_site",
      width: "15%",
      ...getColumnSearchProps("head_of_site"),
    },
    {
      title: "Số lượng",
      className: "text-center",

      children: [
        {
          title: "Nhân viên",
          dataIndex: "number_of_staff",
          key: "building",
          width: "10%",
          className: "text-center",
        },
        {
          title: "Đơn hàng",
          dataIndex: "number_of_goods",
          key: "number",
          width: "10%",
          className: "text-center",
        },
      ],
    },
    {
      title: "Tình trạng",
      render: (_, record) => {
        if (record.number_of_goods > 1000)
          return <p className="font-semibold text-red-500">Quá tải</p>;
        else return <p className="font-semibold text-green-500">Bình thường</p>;
      },
      width: "10%",
    },
    {
      title: "Hành động",
      className: "text-center",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa dữ liệu này?"
            okType="danger"
            okText="Xóa"
            cancelText="Hủy"
          >
            <span
              onClick={() => console.log(record.id)}
              className="text-lg cursor-pointer hover:text-red-600"
            >
              <DeleteOutlined />
            </span>
          </Popconfirm>
        );
      },
      width: "10%",
    },
  ];
  return (
    <div className="w-full h-full py-4">
      <Table
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={data}
        bordered
        scroll={{
          x: "calc(700px + 50%)",
        }}
        pagination={{ pageSize: 3 }}
        title={() => (
          <div className="flex items-center justify-between">
            <Typography.Title className="mb-0" level={3}>
              Điểm Giao dịch và Tập kết
            </Typography.Title>
            <AddSiteModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
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
        )}
      />
    </div>
  );
};

export default CollectionPointTable;
