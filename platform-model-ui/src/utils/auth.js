import Cookies from 'js-cookie'

export const ACCESS_TOKEN = 'x-access-token'
export const REFRESH_TOKEN = 'x-refresh-token'
export const GROUP_ID = 'x-group-id'

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN)
}

export function setAccessToken(token) {
  token = 'ce0414f7-17ce-4025-a781-b5589a92b345'
  return Cookies.set(ACCESS_TOKEN, token)
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN)
}

export function setRefreshToken(token) {
  token = '35d5d6f2-97f5-4a80-a75b-aa434a8fe7ff'
  return Cookies.set(REFRESH_TOKEN, token)
}

export function getGroupId() {
  return Cookies.get(GROUP_ID)
}

export function setGroupId(groupId) {
  return Cookies.set(GROUP_ID, groupId)
}

export function removeToken() {
  Cookies.remove(ACCESS_TOKEN)
  Cookies.remove(REFRESH_TOKEN)
  Cookies.remove(GROUP_ID)
}
