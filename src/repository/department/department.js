import axios from "axios";
import UtilConstants from "../../shared/constants";

export const createDepartment = async (department) => {
    try {
        return await axios.post(UtilConstants.baseUrl + '/department', department);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getDepartments = async () => {
    try {
        return await axios.get(UtilConstants.baseUrl + '/department');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteDepartment = async (departmentId) => {
    try {
        return await axios.delete(`${UtilConstants.baseUrl}/department/${departmentId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}