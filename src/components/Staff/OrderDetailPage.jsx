import { LeftOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Spin, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusLabel from "../statusLabel";
import { useEffect, useState } from "react";
import { getOrderById, getOrderPdf } from "../../repository/order/order";
import { useStoreState } from "../../store/hook";

const OrderDetailPage = () => {
  const [orderData, setOrderData] = useState(null);
  const { id: orderId } = useParams();
  const currentUser = useStoreState((state) => state.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderById = async (orderId) => {
      const res = await getOrderById(orderId);
      console.log(res);
      if (res?.status === 200) {
        setOrderData(res.data.order);
      }
    };
    fetchOrderById(orderId);
  }, [orderId]);
  if (!orderData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin />
      </div>
    );
  }
  const handleExportReceipt = async () => {
    const data = {
      orderId: orderData._id,
    };
    setIsLoading(true);
    const res = await getOrderPdf(data);
    if (res) {
      setIsLoading(false);
      const url = window.URL.createObjectURL(new Blob([res]), {
        type: "application/pdf",
      });
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "order-receipt.pdf");
      document.body.appendChild(link);
      link.click();
    } else {
      setIsLoading(false);
      messageApi.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  const {
    sender,
    receiver,
    status,
    COD,
    weight,
    price,
    type,
    createdAt,
    updatedAt,
    senderPhone,
    receiverPhone,
    send_department,
    receive_department,
    current_department,
    next_department,
  } = orderData;

  const senderInfo = [
    {
      key: "1",
      label: "Họ và tên",
      children: sender,
    },
    {
      key: "2",
      label: "Số điện thoại",
      children: senderPhone,
    },
    {
      key: "3",
      label: "Địa chỉ",
      children: send_department?.name,
    },
  ];
  const receiverInfo = [
    {
      key: "1",
      label: "Họ và tên",
      children: receiver,
    },
    {
      key: "2",
      label: "Số điện thoại",
      children: receiverPhone,
    },
    {
      key: "3",
      label: "Địa chỉ",
      children: receive_department.name,
    },
  ];
  const orderInfo = [
    {
      key: "1",
      label: "Mã đơn hàng",
      children: <p className="font-semibold">{orderId}</p>,
    },
    {
      key: "2",
      label: "Trạng thái",
      children: <StatusLabel status={status} />,
    },
    {
      key: "3",
      label: "Ngày gửi hàng",
      children: new Date(createdAt).toLocaleString("vi-VN"),
    },
    {
      key: "4",
      label: "Trọng lượng",
      children: `${weight} kg`,
    },
    {
      key: "5",
      label: "Loại hàng gửi",
      children: type === "goods" ? "Hàng hóa" : "Tài liệu",
    },
    {
      key: "6",
      label: "Giá trị hàng hóa",
      children: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(price),
    },
    {
      key: "7",
      label: "Cước COD",
      children: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(COD),
    },
    {
      key: "8",
      label: "Địa điểm hiện tại",
      children: current_department?.name,
    },
    {
      key: "9",
      label: "Địa điểm tiếp theo",
      children:
        next_department === null
          ? "Chưa chọn điểm đến tiếp theo"
          : next_department?.name,
    },
  ];
  // const isBoss = currentUser?.role.includes("admin");

  return (
    <>
      {contextHolder}

      <div className="w-full h-full">
        <div className="flex items-center w-full">
          {/* <Link
            to={`/${isBoss ? 'boss':'employee'}/manage-orders`}
            className="p-2 text-black hover:text-black"
          >
            <LeftOutlined className="text-md hover:text-neutral-500" />
          </Link> */}
          <div onClick={() => navigate(-1)}>
            <LeftOutlined className="text-md hover:text-neutral-500 cursor-pointer" />
          </div>
          <Divider type="vertical" />
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-md">Chi tiết đơn hàng</h1>
            {currentUser?.role === "transactionStaff" && (
              <Button
                loading={isLoading}
                onClick={handleExportReceipt}
                icon={<VerticalAlignTopOutlined className="text-md" />}
                size="large"
                type="primary"
              >
                In vận đơn
              </Button>
            )}
          </div>
        </div>

        <div className="mt-[16px]">
          <Descriptions
            title={<h2 className="font-semibold">Người gửi</h2>}
            layout="vertical"
            bordered
            items={senderInfo}
          />
          <Descriptions
            title={<h2 className="mt-3 font-semibold ">Người nhận</h2>}
            layout="vertical"
            bordered
            items={receiverInfo}
          />
          <Descriptions
            title={<h2 className="mt-3 font-semibold">Thông tin Đơn hàng</h2>}
            layout="vertical"
            bordered
            items={orderInfo}
          />
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
