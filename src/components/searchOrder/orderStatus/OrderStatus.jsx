import { Image, Timeline } from "antd";
import moment from "moment";

const OrderStatus = ({ orderInfo }) => {
  const formatTime = (time) => {
    return moment(time).format("DD/MM/YYYY HH:mm");
  };
  const { description, status } = orderInfo;
  const formatOrderDesc = (description) => {
    const res = description.map((item) => {
      let color = "";
      if (item.description.includes("đã")) {
        color = "green";
      } else if (item.description.includes("đang")) {
        color = "blue";
      } else if (item.description.includes("thất bại")) {
        color = "red";
      }
      return {
        label: <p className="font-semibold text-lg">{formatTime(item.date)}</p>,
        color,
        children: (
          <>
            <p className="text-[16px]">{item.description}</p>
          </>
        ),
      };
    });
    return res;
  };
  const orderTimeLine = formatOrderDesc(description);

  return (
    <div className="w-full">
      <div className="mt-[26px] mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Trạng thái vận chuyển</h1>
          <p className="text-sm text-gray-500">
            Xem thông tin hành trình đơn hàng của bạn
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse items-center justify-start gap-x-4 md:p-4 lg:p-8 md:flex-row">
        <Image
          preview={false}
          src="https://cdn.shopify.com/s/files/1/0386/0971/5244/files/track-order_480x480.png?v=1631886893"
        />
        <div className="grow">
          <Timeline items={orderTimeLine} mode="left" />
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
