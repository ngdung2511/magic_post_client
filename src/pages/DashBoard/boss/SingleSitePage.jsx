import {
  EditOutlined,
  LeftOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Image,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDepartmentById } from "../../../repository/department/department";

const SingleSitePage = () => {
  const { id: departmentId } = useParams();
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [currentHead, setCurrentHead] = useState(null);

  useEffect(() => {
    async function fetchDepartmentById() {
      try {
        const res = await getDepartmentById(departmentId);
        if (res.status === 200) {
          console.log(res);
          setCurrentDepartment(res.data.data.gatherPoint);
          setCurrentHead(res.data.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchDepartmentById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);
  console.log(currentDepartment);
  if (!currentDepartment)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin />
      </div>
    );
  const { name, address, region, type, linkDepartments } = currentDepartment;
  const { name: nameOfHead, email, role } = currentHead;
  const siteInfo = [
    {
      key: "1",
      label: "Tên điểm",
      children: name,
    },
    {
      key: "2",
      label: "Loại điểm",
      children: type === "Gathering" ? "Tập kết" : "Giao dịch",
    },
    {
      key: "3",
      label: "Địa chỉ",
      children: address,
    },

    {
      key: "4",
      label: "Các điểm liên kết",
      children: (
        <>
          {linkDepartments.length > 0 ? (
            linkDepartments?.map((item) => {
              console.log(item);
              return <div key={item._id}>{item._id}</div>;
            })
          ) : (
            <p>Không có điểm liên kết</p>
          )}
        </>
      ),
    },
  ];
  const headOfSiteInfo = [
    {
      key: "5",
      label: "Họ và tên",
      children: nameOfHead,
    },
    {
      key: "6",
      label: "Email",
      children: email,
    },
  ];
  return (
    <div className="w-full h-full">
      <div className="flex items-center w-full">
        <Link
          to="/boss/manage-sites"
          className="p-2 text-black hover:text-black"
        >
          <LeftOutlined className="text-md hover:text-neutral-500" />
        </Link>
        <Divider type="vertical" />
        <div className="flex items-center justify-between w-full">
          <h1 className="font-semibold text-md">
            {name} - {region}
          </h1>
          <Button type="primary" size="large" icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
        </div>
      </div>
      <Divider />
      <div className="w-full">
        <div>
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card>
                <Statistic
                  prefix={<ShoppingCartOutlined size={20} />}
                  title="Nhân viên"
                  value={112893}
                />
              </Card>
              <Card>
                <Statistic
                  prefix={<ShoppingCartOutlined size={20} />}
                  title="Đơn hàng"
                  value={112893}
                />
              </Card>
            </div>
          </div>
          <div className="mt-[12px]">
            <Descriptions
              title={<h2 className="font-semibold">Thông tin chi tiết</h2>}
              layout="vertical"
              bordered
              items={siteInfo}
            />
            <Descriptions
              title={<h2 className="mt-2 font-semibold">Trưởng điểm</h2>}
              layout="vertical"
              bordered
              items={headOfSiteInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSitePage;
