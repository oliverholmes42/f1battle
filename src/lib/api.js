// utils/api.js

export async function apiCall(
    endpoint,
    body,
    options= {}
){
    const isGet = !body;
    const url = process.env.NEXT_PUBLIC_BASE_URL+'/api/'+endpoint
    console.log(url)
    const res = await fetch(url, {
        method: isGet ? 'GET' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body: isGet ? undefined : JSON.stringify(body),
        ...options,
    });

    let data = undefined;
    try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = text ? { message: text } : undefined;
        }
    } catch (e) {
        // do nothing — data will stay undefined
        console.log(e)
    }

    return Object.assign(res, { data, error: !res.ok ? (data?.message || res.statusText) : undefined });
}

export async function f1api(endPoint) {
    const url = `https://api.jolpi.ca/ergast/f1/${endPoint}`;
    console.log(url);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // auto-parse JSON
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

