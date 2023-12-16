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
  const { name, departmentId, email, password, role, avatarUrl, phone, gender } = currentEmployee;
  const [form] = Form.useForm();
  // Handle form logic
  const employeeForm = Form.useWatch("employeeForm", {
    form,
    preserve: true,
  });
  
  const inputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // Handle submit form
  const onHandleFinish = async (values) => {
    console.log(values);
    setIsLoading(true);
    
    try {
      const res = await updateEmployee(currentEmployee._id, data);
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
        <div className="w-full h-full pb-6">
          <Form
            form={form}
            onFinish={onHandleFinish}
            initialValues={{
              
            }}
          >
            <div className="flex flex-col w-full mt-5">
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={name}
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

                <Form.Item
                  initialValue={role === "gatheringStaff" ? "Nhân viên tập kết" : "Nhân viên giao dịch"}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chức vụ",
                    },
                  ]}
                >
                  <Select
                    disabled
                    size="large"
                    placeholder="Chức vụ"
                    allowClear
                    options={[
                      {
                        value: "gatheringStaff",
                        label: "Nhân viên tập kết",
                      },
                      {
                        value: "transactionStaff",
                        label: "Nhân viên giao dịch",
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              
            </div>

            <Form.Item noStyle>
              <Button
                disabled={!isDataChanged}
                loading={isLoading}
                type="primary"
                htmlemail="submit"
                className="float-right"
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
