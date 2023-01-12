import moment from "moment";

const getFatPercentage = ({gender, neck, waist, height, hip}: any) => gender === 'male'
    ? (495/(1.0324 - 0.19077*Math.log10(parseFloat(waist)-parseFloat(neck)) + 0.15456*Math.log10(parseFloat(height)))-450).toFixed(2)
    : (495/(1.29579 - 0.35004*Math.log10(parseFloat(waist)+parseFloat(hip)-parseFloat(neck)) + 0.22100*Math.log10(parseFloat(height)))-450).toFixed(2);

const getUserId = () => parseInt(localStorage.getItem("userId"));

const getTodayDate = () => {
    const date = new Date();
    return moment(date).format("DD-MM-YYYY").split("T")[0];
}



export {
    getFatPercentage,
    getUserId,
    getTodayDate
};