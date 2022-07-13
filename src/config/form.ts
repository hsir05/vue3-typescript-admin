
export const statusOptions = [
    {
        label: "正常",
        value: 1,
    },
    {
        label: "锁定",
        value: 0,
    },
];
//锁定状况
export const lockOptions = [
    {
        label: "锁定",
        value: 1,
    },
    {
        label: "正常",
        value: 0,
    },
];


// 可使用的时间
export const withdrawalHourOptions = (() => {
    let hourArr = []
    for (let i = 1; i <= 24; i++) {
        hourArr.push({ label: `${i}时`, value: 1 })
    }
    // hourArr.push({ label: `${0}时`, value: 1, })

    return hourArr
})()

