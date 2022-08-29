const BASE_404 = () => new Response('Not Found.', { status: 404 });

const json = (data) => new Response(JSON.stringify(data), {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});
const jsonSuccess = (data) => json(JsonResponse.success(data));

const jsonError = (code, msg) => json(JsonResponse.error(code, msg));

const JsonResponse = {
    success(data){
        return {
            code: 0,
            msg: 'success',
            data: data,
        }
    },
    error(code, msg){
        return {
            code: code,
            msg: msg,
        }
    }
}

const text = (data) => new Response(data, {
    headers: {
        'Content-Type': 'text/plain; charset=utf-8'
    }
});

const html = (data) => new Response(data, {
    headers: {
        'Content-Type': 'text/html; charset=utf-8'
    }
});

export default {
    BASE_404,
    jsonSuccess,
    jsonError,
    text,
    html
};