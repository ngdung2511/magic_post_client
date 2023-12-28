import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Select, message } from "antd";
import { treeSelectData } from "../../shared/commonData";
import { useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../../store/hook";
import { updateEmployee } from "../../repository/employee/employee";

const EditEmployeeModal = ({
  setIsOpenEditEmployeeModal,
  isOpenEditEmployeeModal,
  currentEmployee,
  setIsEmployeeChanged,
}) => {
  
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [departmentLocation, setDepartmentLocation] = useState(currentEmployee.departmentId.address);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  
  // Handle submit form
  const onHandleFinish = async (values) => {
    //validation info here

    setIsLoading(true);
    const data = {
      name: values.name,
      email: values.email,
      phone: values.phone,  
      gender: values.employeeGender === 'Nam' ? 'male' : 'female',
    };
    try {
      console.log(currentEmployee._id);
      const res = await updateEmployee(currentEmployee._id, data, null);
      if (res.status === 200) {
        messageApi.success("Cập nhật thành công");
        setIsLoading(false);
        setIsDataChanged(false);
        setIsEmployeeChanged(true);
        setIsOpenEditEmployeeModal(false);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Đã có lỗi xảy ra");
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        onCancel={() => setIsOpenEditEmployeeModal(false)}
        open={isOpenEditEmployeeModal}
        title={
          <h2 className="font-semibold">
            <EditOutlined className="p-2 text-white rounded-full bg-[#f15757]" />{" "}
            Chỉnh sửa thông tin nhân viên
          </h2>
        }
        footer={null}
      >
        <div className="grid w-full col-span-8 gap-x-6">
          <Form form={form} onFinish={onHandleFinish}>
            <div className="flex flex-col w-full mt-5">
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={currentEmployee.name}
                  name="name"
                  className="grow"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhân viên",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Tên nhân viên" type="text" />
                </Form.Item>
                <Form.Item onChange={() => setIsDataChanged(true)} name="employeeGender" rules={[{ required: true }]} 
                initialValue={currentEmployee.gender === 'male' ? "Nam" : "Nữ"}>
                <Select
                  size="large"
                  placeholder="Chọn giới tính"
                  options={[
                    {
                      value: "male",
                      label: "Nam",
                    },
                    {
                      value: "female",
                      label: "Nữ",
                    },
                    {
                      value: "other",
                      label: "Khác",
                    },
                  ]}
                />
              </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={currentEmployee.phone}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại",
                    },
                    { max: 10, min: 10, message: "Sai định dạng số điện thoại" },
                  ]}
                >
                  <Input size="large" placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={currentEmployee.email}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email" type="email" />
                </Form.Item>
              </div>
              <div className="flex items-center gap-x-3"> 
              </div>
            </div>

            <Form.Item noStyle>
              <Button
                Button type="primary" htmlType="submit" loading={isLoading} className="float-right"
                disabled={!isDataChanged}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditEmployeeModal;
