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

    async updateUserWeightHistory(user: any, userId: number) {
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
        debugger;
        await firebaseApp.database().ref().update({["/users/"]: users});
    }
}

export default bodyApi;