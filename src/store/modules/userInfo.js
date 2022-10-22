import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			username: '',
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
