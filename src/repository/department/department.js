
import UtilConstants from "../../shared/constants";
import api from '../index'

export const createDepartment = async (department) => {

    return api.post(UtilConstants.baseUrl + '/department', department);

}
export const getDepartments = async () => {

    return api.get(UtilConstants.baseUrl + '/department');

}
export const getDepartmentById = async (departmentId) => {

    return api.get(`${UtilConstants.baseUrl}/department/${departmentId}`);

}
export const deleteDepartment = async (departmentId) => {
    return api.delete(`${UtilConstants.baseUrl}/department/${departmentId}`);

}
export const updateDepartment = async (departmentId, departmentData) => {

    return api.put(`${UtilConstants.baseUrl}/department/${departmentId}`, departmentData);


}
export const getDepartmentByCondition = async (condition) => {
    return api.get(UtilConstants.baseUrl + '/department', { params: { condition } });
}