export type UserData = {
  id: string;
  userName: string;
  roomName: string;
}
class UserService {
  // 記錄使用者資訊
  private userMap: Map<string, UserData>
  constructor() {
    this.userMap = new Map()
  }
  getUser(id: string) {
    if (!this.userMap.has(id)) return null
    const data = this.userMap.get(id)
    if (data) return data
    return null
  }
  addUser(data: UserData) {
    this.userMap.set(data.id, data)
  }
  delUSer(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id)
    }
  }
  getUserDataInfo(id: string, userName: string, roomName: string): UserData {
    return {
      id,
      userName,
      roomName
    }
  }
}

export default UserService