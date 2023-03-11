import moment from "moment";

const getFatPercentage = ({gender, neck, waist, height, hip}: any) => gender === 'male'
    ? parseFloat((495/(1.0324 - 0.19077*Math.log10(parseFloat(waist)-parseFloat(neck)) + 0.15456*Math.log10(parseFloat(height)))-450).toFixed(2))
    : parseFloat((495/(1.29579 - 0.35004*Math.log10(parseFloat(waist)+parseFloat(hip)-parseFloat(neck)) + 0.22100*Math.log10(parseFloat(height)))-450).toFixed(2));

const getUserId = () => {
    const userId = localStorage.getItem("userId");
    if (typeof userId === 'string') 
        return parseInt(localStorage.getItem("userId"));
    return null;
};

const getTodayDate = () => {
    const date = new Date();
    return moment(date).format("DD-MM-YYYY").split("T")[0];
}

const getDate = (isCapitalize: boolean, value?: any) => {
    const date = value ? new Date(value) : new Date();
    const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    // @ts-ignore
    const dayOfWeek: any = days[moment(date).format('e')];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    return {
        dayOfWeek: isCapitalize ? capitalize(dayOfWeek) : dayOfWeek,
        month: isCapitalize ? capitalize(month) : month,
        dayOfMonth,
    }
}

const capitalize = (str: string) => (str.charAt(0).toUpperCase() + str.slice(1));

const getMonthsDayCount = (month: string, year: string) => {
    const monthNum = parseInt(month);
    const isLeapYear = parseInt(year) % 4 === 0;
    if (monthNum === 2) return isLeapYear ? 29 : 28;
    return ((monthNum % 2) && monthNum <= 7 || !(monthNum % 2) && monthNum > 7) ? 31 : 30;
}

export {
    getFatPercentage,
    getUserId,
    getTodayDate,
    getDate,
    getMonthsDayCount,
};