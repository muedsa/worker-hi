const BASE_404 = () => new Response('Not Found.', { status: 404 });

const json = (data) => new Response(JSON.stringify(data), {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
});
const jsonSuccess = (data, others) => json({ code: 0, msg: 'success', data: data, ...others});

const jsonError = (code, msg, others) => json({ code: code, msg: msg , ...others});

const text = (data) => new Response(data, {
    headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
});

const html = (data) => new Response(data, {
    headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
});

const redirect = (url) => Response.redirect(url);

export default {
    BASE_404,
    jsonSuccess,
    jsonError,
    text,
    html,
    redirect
};
