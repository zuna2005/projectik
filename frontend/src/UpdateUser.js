import axios from "axios"

async function UpdateUser(user) {
    const res = await axios.post('http://localhost:8081/user', user)
    .catch(err => console.log(err))
    console.log('update user result', res.data)
    if (res.status == 200) {
        return (res.data.length ? res.data[0] : {status: 'Deleted'})
        }
    
}

export default UpdateUser