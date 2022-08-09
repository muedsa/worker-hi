import { Router } from 'itty-router'
import Res from "./ResponseUtil";
// Create a new router
const router = Router();

// errorHandler
const errorHandler = error => Res.jsonError(error.status || 500, error.message || 'Server Error');

// github repository api
const GITHUB_REPOSITORY_RELEASE_LATEST_URL = "https://github.com/${user}/${repo}/releases/latest";
const GITHUB_REPOSITORY_RELEASE_TAG_URL = "https://github.com/${user}/${repo}/releases/tag/${tag}";
const HEADER = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
	"Accept": "*/*"
}
router.get("/github/:user/:repo/releases/latest", async ({ params }) => {
	const url = GITHUB_REPOSITORY_RELEASE_LATEST_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo);
	const response = await fetch(url, {
		method: 'GET',
		headers: HEADER,
	});
	if(response.status !== 200){
		throw new Error(`fetch ${url}, ${response.status} ${response.statusText}`);
	}
	const html = await response.text();
	return handleTagInfo(html);
});

router.get("/github/:user/:repo/releases/tag/:tag", async ({ params }) => {
	const url = GITHUB_REPOSITORY_RELEASE_TAG_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo)
		.replace("${tag}", params.tag);
	const response = await fetch(url, {
		method: 'GET',
		headers: HEADER,
	});
	if(response.status !== 200){
		throw new Error(`fetch ${url}, ${response.status} ${response.statusText}`);
	}
	const html = await response.text();
	return handleTagInfo(html);
});

function handleTagInfo(html){
	const iterator = html.matchAll(/<meta property="og:(.*?)"\s*content="((?:.|\n)*?)"\s*\/>/g);
	let data = {};
	for (let item of iterator) {
		data[item[1]] = item[2];
		if(item[1] === 'url') {
			let paths = item[2].split('/');
			if(paths[paths.length - 2] === 'tag'){
				data.tag = paths[paths.length - 1];
			}
		}else if(item[1] === 'image:width' || item[1] === 'image:height'){
			data[item[1]] = Number.parseInt(item[2]);
		}
	}
	return Res.jsonSuccess(data);
}

// 404 for everything else
router.all('*', () => Res.BASE_404());

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
	e.respondWith(router.handle(e.request).catch(errorHandler))
});