const makeServerCall = async ({ apiCall, method, queryParameters, bodyParameters }: { apiCall: string, method: "GET" | "PUT" | "PATCH" | "CREATE" | "DELETE" | "POST", queryParameters?: { [name: string]: string | boolean }, bodyParameters?: { [name: string]: string | boolean} }) => {
    console.log(apiCall)
    // console.log("method",method)
    console.log(queryParameters)
    const res = await fetch(`http://localhost:3000/api/${apiCall}`, {
        method : "POST", 
        body: JSON.stringify({ method, queryParameters, bodyParameters })
    });

    try {
        return await res.json()
    } catch (e) {
        return { error: e } 
    }
    
}

export default makeServerCall
