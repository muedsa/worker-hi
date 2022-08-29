import { Router } from 'itty-router'
import Res from "./response-util";
import {handleMetaInfo, handleAssetsInfo} from "./github-page-util";
// Create a new router
const router = Router();

// errorHandler
const errorHandler = error => {
	console.log(error);
	return Res.jsonError(error.status || 500, error.message || 'Server Error');
};

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
	const html = await (await doFetch(url)).text();
	const mateInfo = handleMetaInfo(html);
	mateInfo.assets = handleAssetsInfo(html);
	return Res.jsonSuccess(mateInfo);
});

router.get("/github/:user/:repo/releases/tag/:tag", async ({ params }) => {
	const url = GITHUB_REPOSITORY_RELEASE_TAG_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo)
		.replace("${tag}", params.tag);

	const html = await (await doFetch(url)).text();
	const mateInfo = handleMetaInfo(html);
	mateInfo.assets = handleAssetsInfo(html);
	return Res.jsonSuccess(mateInfo);
});

async function doFetch(url) {
	const response = await fetch(url, {
		method: 'GET',
		headers: HEADER,
	});
	if(response.status !== 200){
		throw new Error(`fetch ${url}, ${response.status} ${response.statusText}`);
	}
	return response;
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