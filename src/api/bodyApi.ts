import {firebaseApp} from "../firebase";

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

    async updateUserWeightHistory(user: any) {
        await firebaseApp.database().ref().update({['/bodyParameters/0/weightHistory/']: user});
    },

    async isAuthorizedUser(userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`users/${userId}/isAuthorize`)
            .once('value', (snap) => snap.val())
            .then((data) => data);
        return data.val();
    },

    async getUserWeight(date: string, userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`bodyParameters/${userId}/weightHistory/${date}`)
            .once('value', (snap) => snap.val());
        if (!data.val())
            return 0;
        return data.val().weight;
    },

    async getUserWeightHistory(userId: number) {
        const data = await firebaseApp
            .database()
            .ref(`bodyParameters/${userId}/weightHistory`)
            .once('value', (snap) => snap.val());
        if (!data.val())
            return 0;
        return data.val();
    }
}

export default bodyApi;