// Tree data for selection input
export const treeSelectData = [
    {
        value: "Hà Nội",
        label: "Hà Nội",
        children: [
            {
                value: "Bắc Từ Liêm",
                label: "Bắc Từ Liêm",
            },
            {
                value: "Nam Từ Liêm",
                label: "Nam Từ Liêm",
            },
            {
                value: "Cầu Giấy",
                label: "Cầu Giấy",
            },
            {
                value: "Hoàng Mai",
                label: "Hoàng Mai",
            },
        ],
    },
    {
        value: "Hồ Chí Minh",
        label: "Hồ Chí Minh",
        children: [
            {
                value: "Quận 1",
                label: "Quận 1",
            },
            {
                value: "Quận 2",
                label: "Quận 2",
            },
            {
                value: "Quận Thủ Đức",
                label: "Quận Thủ Đức",
            },
            {
                value: "Quận Thủ Dầu Một",
                label: "Quận Thủ Dầu Một",
            },
        ],
    },
];

export const orderStatusOptions = [

    { text: "Giao thành công", value: "delivered" },
    { text: "Chờ xác nhận", value: "processing" },
    { text: "Chuyển tiếp thất bại", value: "rejected" },
    { text: "Đã xác nhận", value: "accepted" },

]