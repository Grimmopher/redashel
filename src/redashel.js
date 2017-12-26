class Redashel {
    constructor(redashUrl, queryId, apiKey) {
        this.redashUrl = redashUrl;
        this.queryId = queryId;
        this.apiKey = apiKey;
    }

    query = async (params) => {
        let url = this.redashUrl + params.reduce( (u, p) => { return `${u}p_${p.key}=${p.value}&` } , '?')
        let init = {
            headers: new Headers().append('Authorization', `Key ${this.apiKey}`),
            method: 'POST'
        }
    }
}