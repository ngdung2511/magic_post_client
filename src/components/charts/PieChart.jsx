import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ chartData, options }) => {
  return <Doughnut data={chartData} options={options} />;
};

export default DonutChart;
