import { action, persist, createStore, thunk } from 'easy-peasy';
import { getDepartmentById, getDepartments } from '../repository/department/department';
import { getUserById } from '../repository/user/user';
import { getEmployees, getEmployeeByDepartmentId } from '../repository/employee/employee';
import { getAllOrders } from '../repository/order/order';

export const store = createStore({
  currentUser: persist({
    loggedIn: false,
    email: '',
    password: ''
  }, {
    storage: 'localStorage'
  }),
  setUserInfo: action((state, payload) => {
    state.currentUser = payload;
  }),
  removeState: action((state) => {
    state.currentUser = {
      loggedIn: false,
      email: '',
      password: ''
    };

  }),
  departments: [],
  setDepartments: action((state, departments) => {
    state.departments = departments;
  }),
  fetchDepartments: thunk(async (actions) => {
    try {
      const res = await getDepartments();
      console.log(res);
      actions.setDepartments(res.data.departments);
    } catch (error) {
      console.log(error);
    }
  }),
  // fetchDepartmentById: thunk(async (actions, id) => {
  //   try {
  //     const res = await getDepartmentById(id);
  //     return res.data.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }),
  employees: [],
  setEmployees: action((state, employees) => {
    state.employees = employees;
  }),

  fetchEmployeesByDepartment: thunk(async (actions, id) => {
    try {
      const res = await getEmployeeByDepartmentId(id);
      let employees = res.data.data.users;
      const indexOfObject = employees.findIndex(object => {
        return object.role === "headTransaction" || object.role === "headGathering";
      });
      employees.splice(indexOfObject, 1);
      actions.setEmployees(employees);
    } catch (error) {
      console.log(error);
    }
  }),
  fetchUserById: thunk(async (actions, id) => {
    try {
      const res = await getUserById(id);
      console.log(res);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  }),
  orders: [],
  fetchAllOrders: thunk(async (actions) => {
    const res = await getAllOrders();
    if (res?.status === 200) {
      actions.setAllOrders(res.data.orders);

    } else {
      console.error("Error fetching orders:", res);
    }
  }),
  setAllOrders: action((state, orders) => {
    state.orders = orders;
  }),

});
