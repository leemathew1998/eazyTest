import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			username: String(Math.random()*100),
			password:'',
			token:''
		}
	},
	actions: {
		changeName() {
			this.username = 'pinia yes!'
		},
	},
})
