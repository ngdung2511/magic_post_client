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
