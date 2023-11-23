import { Checkbox } from "antd";

const OrderInfoTable = () => {
  const options = [
    {
      label: "Tài liệu",
      value: "documents",
    },
    {
      label: "Hàng hóa",
      value: "goods",
      disabled: true,
    },
  ];
  return (
    <table className="w-full overflow-hidden bg-white rounded-lg shadow-md table-auto">
      <thead className="bg-gray-200">
        <tr>
          <th
            className="px-6 py-3 text-sm font-semibold text-left uppercase"
            colSpan="2"
          >
            Thông tin người gửi
          </th>
          <th
            className="px-6 py-3 text-sm font-semibold text-left uppercase"
            colSpan="2"
          >
            Thông tin người nhận
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        <tr>
          <td className="px-6 py-3 border-b border-r border-gray-200">Name</td>
          <td className="px-6 py-3 border-b border-gray-200">John Doe</td>
          <td className="px-6 py-3 border-b border-r border-gray-200">Name</td>
          <td className="px-6 py-3 border-b border-gray-200">Jane Smith</td>
        </tr>
        <tr>
          <td className="px-6 py-3 border-b border-r border-gray-200">Phone</td>
          <td className="px-6 py-3 border-b border-gray-200">123-456-7890</td>
          <td className="px-6 py-3 border-b border-r border-gray-200">Phone</td>
          <td className="px-6 py-3 border-b border-gray-200">987-654-3210</td>
        </tr>
        <tr>
          <td className="px-6 py-3 border-b border-r border-gray-200">
            Address
          </td>
          <td className="px-6 py-3 border-b border-gray-200">123 Main St</td>
          <td className="px-6 py-3 border-b border-r border-gray-200">
            Address
          </td>
          <td className="px-6 py-3 border-b border-gray-200">456 Oak St</td>
        </tr>
        <tr>
          <td className="px-6 py-3 border-b border-r border-gray-200">
            Postal Code
          </td>
          <td className="px-6 py-3 border-b border-gray-200">ABC123</td>
          <td className="px-6 py-3 border-b border-r border-gray-200">
            Postal Code
          </td>
          <td className="px-6 py-3 border-b border-gray-200">XYZ789</td>
        </tr>
        <tr>
          <td
            className="px-6 py-3 border-b border-r border-gray-200"
            colSpan="2"
          >
            Type of Goods:{" "}
            <span>
              <Checkbox.Group options={options} defaultValue={["documents"]} />
            </span>
            <br />
            Sending Time: November 23, 2023
          </td>
          <td
            className="px-6 py-3 border-b border-r border-gray-200"
            colSpan="2"
          >
            Fee: $15.00 | Weight: 2.5kg
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderInfoTable;
