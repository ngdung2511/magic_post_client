import axios from "axios";
import UtilConstants from "../../shared/constants";

export const signin = async (user) => {
    try {         
        return await axios.post(UtilConstants.baseUrl + '/signin', user); 
    } catch (error) {
        console.log('errror', error);
        throw error;
    }
}
