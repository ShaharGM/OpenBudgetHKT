const MAX_QUERY_RETRIES = 200;
const DEFAULT_MAX_AGE = 9999;

export interface GetRedashQueryDataProps<QParams = { [key in string]: string }> {
    redashURL: string;  // e.g. https://app.redash.io/hasadna
    queryId: number;  // e.g. 185581
    queryParams?: QParams;  // e.g. {"userCityID": 123121}
    /* If query results less than `max_age` seconds old are available,
     * return them, otherwise execute the query; if omitted or - 1, returns
     * any cached result, or executes if not available.Set to zero to
     * always execute. */
    maxAge?: number;
    retries?: number;
    userApiKey: string;
}

export const getRedashQueryData = async <QParams = { [key in string]: string }>(
    {
        redashURL,
        queryId,
        queryParams,
        maxAge = DEFAULT_MAX_AGE,
        retries = MAX_QUERY_RETRIES,
        userApiKey
    }: GetRedashQueryDataProps<QParams>
) => {
    const jobBody = { id: queryId, parameters: queryParams, max_age: maxAge };

    const jobResponse = await fetch(`${redashURL}/api/queries/${queryId}/results`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Key ${userApiKey}`
        }),
        body: JSON.stringify(jobBody)
    });

    const jobResponseBody = await jobResponse.json();

    if (jobResponseBody && jobResponseBody.query_result) {
        return jobResponseBody.query_result;
    } else if (!jobResponseBody
        || !jobResponseBody.job
        || "" !== jobResponseBody.job.error
        || !jobResponseBody.job.id) {
        const error = `Failed to start query job ${queryId} with params ${JSON.stringify(queryParams)}.` +
            (jobResponseBody && jobResponseBody.job && jobResponseBody.job.error ?
                " " + JSON.stringify(jobResponseBody.job.error) :
                jobResponseBody && jobResponseBody.message ?
                    jobResponseBody.message : "");
        throw Error(error);
    }

    let resultId;
    for (let i = 0; i < retries; i++) {
        const checkResponse = await fetch(`${redashURL}/api/jobs/${jobResponseBody.job.id}`, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Key ${userApiKey}`
            })
        });
        const checkResponseBody = await checkResponse.json();
        if (checkResponseBody && checkResponseBody.job && checkResponseBody.job.query_result_id) {
            resultId = checkResponseBody.job.query_result_id;
            break;
        } else if (checkResponseBody
            && checkResponseBody.job
            && !checkResponseBody.job.error) {
            await setTimeout(() => undefined, 1500);
            continue;
        } else {
            const error = `Query job ${queryId} with params ${JSON.stringify(queryParams)} failed. ${JSON.stringify(checkResponseBody)}` +
                (checkResponseBody && checkResponseBody.job && checkResponseBody.job.error ? JSON.stringify(checkResponseBody.error) :
                    checkResponseBody && checkResponseBody.message ? checkResponseBody.message : "");
            throw Error(error);
        }
    }

    const response = await fetch(
        `${redashURL}/api/query_results/${resultId}`, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Key ${userApiKey}`
            })
        }
    );
    const data = await response.json();
    if (!data
        || !data.query_result
        || !data.query_result.data
        || !data.query_result.data.rows
        || 0 === data.query_result.data.rows.length) {
        const error = `Recieved response in unexpected format ${JSON.stringify(data)}`;
        throw Error(error);
    }

    return data.query_result;
};
