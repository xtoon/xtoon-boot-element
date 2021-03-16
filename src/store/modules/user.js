export default {
  namespaced: true,
  state: {
    id: 0,
    name: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateTenantName (state, tenantName) {
      state.tenantName = tenantName
    },
    updateUsers (state, users) {
      state.users = users
    }
  }
}
