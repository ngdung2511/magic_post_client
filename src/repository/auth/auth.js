import axios from "axios";
import UtilConstants from "../../shared/constants";

export const signin = async (email, password) => {
    try {
        const data = {
            email: email,
            password: password
        }

        return await axios.post(UtilConstants.baseUrl + '/auth/login', data);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

export const forgetPassword = async (email) => {
    try {
        const data = {
            email: email,
        }

        return await axios.post(UtilConstants.baseUrl + '/auth/forget-password', data);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

export const checkVerifyCode = async (information) => {
    try {
        
        return await axios.post(UtilConstants.baseUrl + '/auth/reset-password', information);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
