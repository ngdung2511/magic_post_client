import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login/Login';
import DashBoard from './pages/DashBoard/DashBoard';
import NotFound from './pages/NotFound/NotFound';

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
            <Route key={i} path={e.path} element={e.component}/>
          ))}
          <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
