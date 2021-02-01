const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  dictList: state => state.dictionary.dictList,
  startDict: state => state.dictionary.startDict,
  booleanDict: state => state.dictionary.booleanDict,
  genderDict: state => state.dictionary.genderDict
}
export default getters
