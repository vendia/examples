import axios from "axios";

export class VendiaClient {

    constructor(url, headers) {
        this.url = url;
        this.headers = headers;
    }

    invokeVendiaShare(body) {
        return axios.post(
            this.url,
            body,
            {headers: this.headers}
        )
    }
}
