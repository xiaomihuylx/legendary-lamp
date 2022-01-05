const getters = {
	cartLength(state) {
		return state.cartList.length
	},
	cartList(state) {
		return state.cartList
	}
}

export default getters
