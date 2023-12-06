import { PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Divider, Form, Input, Modal, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { createEmployee, getEmployeeById } from "../../repository/employee/employee";

const CreateEmployeeModal = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = useForm();

  // Handle modal
  const handleOk = () => {
    setIsModalOpen(false);
    onHandleFinish();
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const onHandleFinish = async (values) => {
    setIsLoading(true);
    // console.log(values);
    const currentUser = useStoreState((state) => state.currentUser);
    currentUser.role === "headTransaction"
      ? (values.role = "transactionStaff")
      : (values.role = "gatheringStaff");

    await getEmployeeById(currentUser.id).then((res) => { currentUser.departmentId = res.data.departmentId });
    
    const data = {
      user: {
        name: values.employeeName,
        departmentId: currentUser.departmentId,
        email: values.employeeEmail,
        password: values.employeePassword,
        role: values.role,
      },
    };
    // console.log(data);

    try {
      const res = await createEmployee(data);
      if (res.status === 201) {
        //fetchDepartments();
        messageApi.success("Tạo nhân viên thành công");
        setIsLoading(false);
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      if (error.response.data.message === "this user existed") {
        messageApi.error("Email đã tồn tại");
      } else if (
        error.response.data.message === "this gathering point already exists"
      ) {
        messageApi.error("Điểm đã tồn tại");
      } else messageApi.error("Đã có lỗi xảy ra");
      setIsLoading(false);
      console.log(error.response.data.message);
    }
  };

  const provinces = [
    "An Giang",
    "Bà Rịa-Vũng Tàu",
    "Bạc Liêu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Định",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Cần Thơ",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lạng Sơn",
    "Lào Cai",
    "Lâm Đồng",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  return (
    <Modal
      title={
        <>
          <h1 className="mb-[10px] text-3xl font-semibold">
            <PlusCircleTwoTone twoToneColor="#f15757" />
            <span className="ml-[10px]">Tạo nhân viên</span>
          </h1>
        </>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="w-full h-full pb-6">
        <Form form={form} onFinish={onHandleFinish}>
          <h2 className="py-3 text-xl font-semibold">Thông tin nhân viên</h2>
          <div className="grid w-full col-span-8 gap-x-6">
            <div className="col-span-4">
              <Form.Item name="employeeName">
                <Input size="large" placeholder="Tên nhân viên" type="text" />
              </Form.Item>
              <Form.Item name="employeeEmail">
                <Input size="large" placeholder="Nhập email" type="email" />
              </Form.Item>
              <Form.Item name="employeePassword">
                <Input size="large" placeholder="Nhập mật khẩu" type="text" />
              </Form.Item>
              <Form.Item name="employeeRePassword">
                <Input
                  size="large"
                  placeholder="Nhập lại mật khẩu"
                  type="text"
                />
              </Form.Item>
            </div>
            <div className="col-span-4 col-start-5">
              <Form.Item name="employeeAddress">
                <Input size="large" placeholder="Địa chỉ nơi làm" type="text" />
              </Form.Item>
              <Form.Item
                name="employeePhoneNumber"
                rules={[
                  { max: 10, min: 10, message: "Sai định dạng số điện thoại" },
                ]}
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item name="employeeGender" rules={[{ required: true }]}>
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
          </div>

          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" className="float-right">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateEmployeeModal;
