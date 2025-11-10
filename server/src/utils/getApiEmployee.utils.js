import axios from 'axios'

export const getApiEmployee = async (params = { includeIntern: false }, includePagination = false) => {
    try {
        const API_URL = process.env.EXTERNAL_API || "https://pkl-api-pendataan-karyawan.stagingapps.net/external/api"
        let url;

        if (params.nik) {
            url = `${API_URL}/employee`
        } else if (params.username) {
            url = `${API_URL}/employee/username`
        } else {
            url = `${API_URL}/employees`
        }
        console.log(url, params)

        const response = await axios.get(url, { params });
        // console.log(response)

        if (params.nik || params.username) {
            return response.data.data
        } else if (includePagination) {
            return response.data.data
        } else {
            return response.data.data.employees;
        }
    } catch (error) {
        console.error(`Terjadi error : ${error}`);
        // console.log(error.data.message)
        // console.log(error)
        const err = new Error(error.response.data.message)
        err.statusCode = error.response.data.status_code
        throw err;
    }
}