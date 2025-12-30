import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as User,
    }),
    actions: {
        login(user: User) {
            this.user = user;
        },
        logout() {
            this.user = {} as User;
        },
        isLoggedIn() {
            return this.user.id != null;
        }
    },
    persist: true
});
