import axios from "axios";
import UtilConstants from "../../shared/constants";
import { utilFuncs } from "../../utils/utils";

import api from '../index'
export const createEmployee = async (user) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`
        }
        const res = await axios.post(UtilConstants.baseUrl + '/user', user, { headers: header });

        return res;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const createEmployeeFromFile = async (file) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`,
            'Content-Type': 'multipart/form-data'
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(UtilConstants.baseUrl + '/users/import', formData, { headers: header });

        return res;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployees = async () => {
    try {
        return await axios.get(UtilConstants.baseUrl + '/users');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeByDepartmentId = async (departmentId) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`
        }
        const condition = {
            departmentId: departmentId
        };

        return await axios.get(UtilConstants.baseUrl + `/users?condition=${JSON.stringify(condition)}`, { headers: header });
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeById = async (userId) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`
        }
        return await axios.get(`${UtilConstants.baseUrl}/user/${userId}`, { headers: header });
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteEmployee = async (userId) => {
    try {
        return await api.delete(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const updateEmployee = async (userId, userData, image) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`
        }
        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);
        formData.append('gender', userData.gender);

        return await axios.put(`${UtilConstants.baseUrl}/user/${userId}`, formData, { headers: header });
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeByCondition = (condition) => {
    return api.get(`${UtilConstants.baseUrl}/users`, { params: { condition } });
}