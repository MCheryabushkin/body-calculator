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

const getTodayDate = (date?: string) => {
    const newDate = date ? new Date(date) : new Date();
    return moment(newDate).format("DD-MM-YYYY").split("T")[0];
}

const formatDate = (date: string) => {
    const [dd, mm, yyyy] = date.split('-');
    return `${yyyy}-${mm}-${dd}`;
}

const getDate = (isCapitalize: boolean = false, value?: any) => {
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

const randomStringKey = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export {
    getFatPercentage,
    getUserId,
    getTodayDate,
    getDate,
    getMonthsDayCount,
    formatDate,
    randomStringKey,
};