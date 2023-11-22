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
export const getDepartment = async () => {
    try {
        return await axios.post(UtilConstants.baseUrl + '/department');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}