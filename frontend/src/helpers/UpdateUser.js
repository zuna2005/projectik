import axios from "axios"

const updateUser = async (id) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/user`, { id });
        if (res.data.length) {
            return res.data[0]
        }
        return res.data.length ? res.data[0] : { status: 'Deleted' }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export default updateUser