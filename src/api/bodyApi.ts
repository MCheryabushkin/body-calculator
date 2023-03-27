import {firebaseApp} from "../firebase";
import { getTodayDate } from "../utils/util.helper";

const bodyApi = {
    async getUsers() {
        const data = await firebaseApp
            .database()
            .ref('users/')
            .once('value', (snap) => snap.val());
        return data.val();
    },

    async getUserById(id: number) {
        const users = await this.getUsers();
        const user = users.find((user: any) => user.id === id);

       return user;
    },

    async updateUser(user: any) {
        await firebaseApp.database().ref().update(user);
    },

    async createUserWeightHistory(userId: number, userWeight: number) {
        const bodyParameters = await this.getBodyParameters();
        const today = getTodayDate();
        bodyParameters.push({
            userId,
            weightHistory: {[today]: {weight: userWeight}}
        });
        await firebaseApp.database().ref().update({[`/bodyParameters/`]: bodyParameters});
    },

    async updateBodyParameters(user: any, userId: number) {
        await firebaseApp.database().ref().update({[`/bodyParameters/${userId}/weightHistory/`]: user});
    },

    async isAuthorizedUser(userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`users/${userId}/isAuthorize`)
            .once('value', (snap) => snap.val())
            .then((data) => data);
        return data.val();
    },

    async getUserParams(date: string, userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`bodyParameters/${userId}/weightHistory/${date}`)
            .once('value', (snap) => snap.val());
        if (!data.val())
            return 0;
        return data.val();
    },

    async getUserWeightHistory(userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`bodyParameters/${userId}/weightHistory`)
            .once('value', (snap) => snap.val());
        if (!data.val())
            return 0;
        return data.val();
    },

    async loginUser(login: string, password: string) {
        const users = await this.getUsers();
        const user = users.find((user: any) => user.email === login);

        if (!user)
            return 'User not found';
        
        if (user.password !== password)
            return 'Wrong password';
       return user;
    },

    async setAuthorize(userId: number, isAuthorize: boolean) {
        await firebaseApp.database().ref().update({[`/users/${userId}/isAuthorize`]: isAuthorize});
    },

    async addNewUser(user: any) {
        const users = await this.getUsers();
        const id = users.length;
        const newUser = Object.assign(user, {
            id,
            isAuthorize: true,
        });
        users.push(newUser);
        await firebaseApp.database().ref().update({["/users/"]: users})
            .then(() => this.createUserWeightHistory(newUser.id, newUser.weight));
    },

    async getBodyParameters() {
        const data = await firebaseApp
            .database()
            .ref('bodyParameters/')
            .once('value', (snap) => snap.val());
        return data.val();
    },

    async getBodyParametersByUserId(userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`users/${userId}/bodyParameters`)
            .once('value', (snap) => snap.val());
        return data.val();
    },

    async getWeightHistory(userId: number) {
        const bodyParameters = await this.getBodyParameters();
        return bodyParameters[userId].weightHistory;
    },

    async sendWeeklyReport({ fat: newFat, label: newLabel, weight: newWeight, userId, minWeight, neck, waist, hip }: 
        { fat: number, label: string, weight: string | number, userId: number, minWeight: number, neck: number, waist: number, hip: number }) {
        let {fat, labels, weight, reportData} = await this.getBodyParametersByUserId(userId);
        fat.push(newFat);
        labels.push(newLabel);
        weight.push(newWeight);
        if (!reportData)
            reportData = [];

        reportData.push({
            fat: newFat,
            weight: newWeight,
            minWeight,
            reportNumber: reportData.length + 1,
            date: newLabel.split(" ")[1],
            neck, waist, hip
        })

        await firebaseApp.database().ref().update({[`/users/${userId}/bodyParameters/fat`]: fat});
        await firebaseApp.database().ref().update({[`/users/${userId}/bodyParameters/labels`]: labels});
        await firebaseApp.database().ref().update({[`/users/${userId}/bodyParameters/weight`]: weight});
        await firebaseApp.database().ref().update({[`/users/${userId}/bodyParameters/reportData`]: reportData});
    }
}

export default bodyApi;