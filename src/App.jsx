import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import DashBoard from "./pages/DashBoard/DashBoard";
import NotFound from "./pages/NotFound/NotFound";
import ManageSitePage from "./pages/DashBoard/boss/ManageSitePage";
import SingleSitePage from "./pages/DashBoard/boss/SingleSitePage";
import GoodsStatsPage from "./pages/DashBoard/boss/GoodsStatsPage";
import ManageAccountPage from "./pages/DashBoard/headOfSite/ManageAccountPage";
import GoodsInventoryPage from "./pages/DashBoard/headOfSite/GoodsInventoryPage";
import SingleEmployeePage from "./pages/DashBoard/headOfSite/SingleEmployeePage"
import StatisticPage from "./pages/DashBoard/headOfSite/StatisticPage";
import Home from "./pages/Home/Home";
import Hero from "./components/hero/Hero";
import ForgetPassword from "./pages/forgetPass/ForgetPassword";
import OrderDetailPage from "./components/Staff/OrderDetailPage";
import ManageOrderPage from "./pages/DashBoard/employee/ManageOrderPage";
import { useStoreState } from "./store/hook";

function App() {
  const currentUser = useStoreState((state) => state.currentUser);
  console.log("current user", currentUser);
  const ROUTE = [
    {
      path: "/login",
      component: <Login />,
      exact: true,
      isPublic: true,
    },
    {
      path: "/dashboard",
      component: <DashBoard />,
      exact: true,
      isPublic: true,
    },
    {
      path: "/notfound",
      component: <NotFound />,
      exact: true,
      isPublic: true,
    },
  ];

  const notAuth = (
    <>
      cút ra khỏi đây
    </>
  )

  return (
    <>
      <BrowserRouter>
        <Routes>
          {ROUTE.map((e, i) => (
            <Route key={i} path={e.path} element={e.component} />
          ))}
          {/* <Route path="*" element={<Navigate to="/notfound" />} /> */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/" element={<DashBoard />}>
            <Route path="boss/manage-sites" element={currentUser.role === 'admin'? <ManageSitePage /> : notAuth} />
            <Route path="boss/manage-sites/:id" element={currentUser.role === 'admin'? <SingleSitePage /> : notAuth} />
            <Route path="boss/goods-stats" element={currentUser.role === 'admin'? <GoodsStatsPage /> : notAuth} />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <Route
              path="head/manage-accounts"
              element={currentUser.role?.includes('head')? <ManageAccountPage /> : notAuth}
            />
            <Route
              path="head/manage-account/:id"
              element={currentUser.role?.includes('head')? <SingleEmployeePage /> : notAuth}
            />
            <Route
              path="head/goods-inventory"
              element={currentUser.role?.includes('head')? <StatisticPage /> : notAuth}
            />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <Route
              path="employee/manage-orders"
              element={<ManageOrderPage />}
            />
            <Route
              path="employee/order-detail/:id"
              element={<OrderDetailPage />}
            />
          </Route>
          <Route path="/home" element={<Home />}>
            <Route index element={<Hero />} />
            <Route path="/home/login" element={<Login />} />
            <Route path="/home/forget-password" element={<ForgetPassword />} />
          </Route>
          <Route path="/home/tracking/:id" element={<Home />}>
            <Route index element={<Hero />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
