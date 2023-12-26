import { Card, Statistic } from "antd";

const StatsCard = ({ icon: Icon, label, value, bgColor }) => {
  return (
    <Card>
      <Statistic
        prefix={
          <div
            className={`font-semibold mr-1 w-10 h-10 flex items-center justify-center text-white rounded-full ${bgColor}`}
          >
            <Icon size={20} />
          </div>
        }
        title={<p className="text-lg font-medium text-neutral-600 ">{label}</p>}
        value={value}
      />
    </Card>
  );
};

export default StatsCard;
