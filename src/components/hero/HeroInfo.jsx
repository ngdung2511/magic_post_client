import { NavLink } from "react-router-dom";

const HeroInfo = () => {
  return (
    <div className="flex flex-col justify-center h-full gap-4 px-4 pt-8 pb-4">
      <h1 className="text-4xl font-bold">Magic Post</h1>
      <p className="text-lg font-normal">
        Kết nối người gửi hàng với các đối tác vận chuyển chất lượng, cung cấp
        lựa chọn linh hoạt!
      </p>

      <div className="max-w[400px]">
        <NavLink to="/home/login">
          <button className="cursor-pointer w-full py-5 px-8 md:py-4 text-xl border border-black rounded-md hover:bg-[#f15757] transition hover:text-white bg-white">
            Đăng nhập
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default HeroInfo;
