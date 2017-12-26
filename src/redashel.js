// returns a promise that returns after t milliseconds
const deley = (t) => {
    return new Promise( (res) => {
        setTimeout(res, t);
    });
}

const queryResults = async (url, header, resultId) => {
    let res = await fetch(url, { headers: header, method: 'GET' })
}

// Waiting for job status code 3
// Redash returns status code 2 while it is running the query
// and status code 3 when the query has finished.
const jobForQuery = async (url, header, jobId, timeout = 60000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        let res = await fetch(url + jobId, { headers: header, method: 'GET' });
        if (res.data.job.status === 3) return res;
        await deley(500);
    }
    
}

const refreshQuery = async (url, header, params) => {
    let refreshUrl = url + params.reduce( (u, p) => { return `${u}p_${p.key}=${p.value}&` } , '?')
    let res = await fetch(refreshUrl, { headers: header, method: 'POST' });
    return res;
}

class Redashel {
    constructor({redashUrl, queryId, apiKey} = {}) {
        this.refreshUrl = `${redashUrl}/api/queries/${queryId}/refresh`;
        this.jobUrl = `${redashUrl}/api/jobs/`;
        this.resultUrl = `${redashUrl}/api/queries/${queryId}/results/`;
        this.authHeader = new Headers().append('Authorization', `Key ${apiKey}`);
    }

    query = async (params) => {
        let refresh = await refreshQuery(this.refreshUrl, this.authHeader, params);
        let job = await jobForQuery(this.jobUrl, this.authHeader, refresh.data.job.id);
        let results = await queryResults(this.resultUrl, job.data.job.query_result_id);
    }
}

module.exports = Redashel;