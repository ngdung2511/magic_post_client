import axios from "axios";
import UtilConstants from "../../shared/constants";

export const createEmployee = async (user) => {
    try {
        return await axios.post(UtilConstants.baseUrl + '/user', user);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployees = async () => {
    try {
        return await axios.get(UtilConstants.baseUrl + '/user');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeById = async (userId) => {
    try {
        return await axios.get(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteEmployee = async (userId) => {
    try {
        return await axios.delete(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const updateEmployee = async (userId, userData) => {
    try {
        return await axios.put(`${UtilConstants.baseUrl}/user/${userId}`, userData);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}