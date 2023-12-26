import UtilConstants from "../../shared/constants";
import api from '../index'

export const createOrder = async (order) => {
    return api.post(UtilConstants.baseUrl + '/order', order)
}
export const getOrderByDepartmentId = async (departmentId) => {
    return api.get(`${UtilConstants.baseUrl}/orders/department/${departmentId}`)
}
export const getAllOrders = async () => {
    return api.get(`${UtilConstants.baseUrl}/orders`)

}
export const deleteOrder = async (orderId) => {
    return api.delete(`${UtilConstants.baseUrl}/orders/${orderId}`)
}
export const getOrderById = async (orderId) => {
    return api.get(`${UtilConstants.baseUrl}/orders/${orderId}`)
}
export const getOrderByCondition = async (condition) => {
    return api.post(UtilConstants.baseUrl + '/orders', condition);
}
export const updateOrder = async (ordersData) => {
    return api.post(`${UtilConstants.baseUrl}/orders-status`, ordersData)
}
export const getOrderPdf = async (orderId) => {
    return api.post(`${UtilConstants.baseUrl}/orders-pdf`, orderId, {
        headers: {
            "Content-Type": "application/json",
        },
        responseType: "blob",
    })
}