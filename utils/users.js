let users = []

// Add user into array
//* id = socket.id - Allocated from backend
//* username = username - Allocated from frontend
//* room = room - Allocated from frontend
export function userJoin(id, username, room){
    const user = {id, username, room}
    users.push(user)
    return user
}

// Get current user
export function getCurrentUser(id){
    return users.find(user => user.id === id)
}

export function removeUserFromRoom(id){
    users = users.filter(user => user.id !== id)
}

export function getRoomUsers(room){
    return users.filter(user => user.room === room)
}