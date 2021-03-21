const makeServerCall = async ({ apiCall, method, queryParameters, bodyParameters }: { apiCall: string, method: "GET" | "PUT" | "PATCH" | "CREATE" | "DELETE" | "POST", queryParameters?: { [name: string]: string }, bodyParameters?: { [name: string]: string } }) => {
    const res = await fetch(`http://localhost:3000/api/${apiCall}`, {
        method : "POST", 
        body: JSON.stringify({ method, queryParameters, bodyParameters })
    });
    return await res.json()
}

export default makeServerCall
