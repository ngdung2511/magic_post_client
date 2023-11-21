import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import DashBoard from "./pages/DashBoard/DashBoard";
import NotFound from "./pages/NotFound/NotFound";
import ManageSitePage from "./pages/DashBoard/boss/ManageSitePage";
import SingleSitePage from "./pages/DashBoard/boss/SingleSitePage";
import GoodsStatsPage from "./pages/DashBoard/boss/GoodsStatsPage";
import ManageAccountPage from "./pages/DashBoard/headOfSite/ManageAccountPage";
import GoodsInventoryPage from "./pages/DashBoard/headOfSite/GoodsInventoryPage";
import Home from "./pages/Home/Home";
import Hero from "./components/hero/Hero";
import ForgetPassword from "./pages/forgetPass/ForgetPassword";

function App() {
  const ROUTE = [
    {
      path: "/login",
      component: <Login />,
      exact: true,
      isPublic: true,
    },
    {
      path: "/",
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

  return (
    <>
      <BrowserRouter>
        <Routes>
          {ROUTE.map((e, i) => (
            <Route key={i} path={e.path} element={e.component} />
          ))}
          <Route path="*" element={<Navigate to="/notfound" />} />
          <Route path="/" element={<DashBoard />}>
            <Route path="/boss/manage-sites" element={<ManageSitePage />} />
            <Route path="/boss/manage-sites/:id" element={<SingleSitePage />} />
            <Route path="/boss/goods-stats" element={<GoodsStatsPage />} />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <Route
              path="/head/collection-point/manage-accounts"
              element={<ManageAccountPage />}
            />
            <Route
              path="/head/collection-point/goods-inventory"
              element={<GoodsInventoryPage />}
            />
          </Route>
          <Route path="/home" element={<Home />}>
            <Route index element={<Hero />} />
            <Route path="/home/login" element={<Login />} />
            <Route path="/home/forget-password" element={<ForgetPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
