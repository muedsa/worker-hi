import { Router } from 'itty-router';
import { initDebug } from "./debug";
import Res from "./response-util";
import {handleMetaInfo, handleAssetsInfo} from "./github-page-util";
// Create a new router
const router = Router();

// errorHandler
const errorHandler = (error, event) => {
	let others = {};
	if(event.__debug_log && event.__debug_log.debugFlag) {
		others.debug = event.__debug_log.toString();
	}
	return Res.jsonError(error.status || 500, error.message || 'Server Error', others);
};

// github repository api
const GITHUB_REPOSITORY_RELEASE_LATEST_URL = "https://github.com/${user}/${repo}/releases/latest";
const GITHUB_REPOSITORY_RELEASE_TAG_URL = "https://github.com/${user}/${repo}/releases/tag/${tag}";
const GITHUB_REPOSITORY_RELEASE_TAG_ASSERT_URL = "https://github.com/${user}/${repo}/releases/expanded_assets/${tag}";
const HEADER = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
	"Accept": "*/*"
}
router.get("/github/:user/:repo/releases/latest", async ({ params, __debug_log }) => {
	const url = GITHUB_REPOSITORY_RELEASE_LATEST_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo);
	const html = await (await doFetch(url, __debug_log)).text();
	const mateInfo = handleMetaInfo(html);
	if(__debug_log && __debug_log.debugFlag) mateInfo.__debug_log = __debug_log.toString();
	return Res.jsonSuccess(mateInfo);
});

router.get("/github/:user/:repo/releases/tag/:tag", async ({ params, __debug_log }) => {
	const url = GITHUB_REPOSITORY_RELEASE_TAG_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo)
		.replace("${tag}", params.tag);

	const html = await (await doFetch(url, __debug_log)).text();
	const mateInfo = handleMetaInfo(html);
	if(__debug_log && __debug_log.debugFlag) mateInfo.__debug_log = __debug_log.toString();
	return Res.jsonSuccess(mateInfo);
});

router.get("/github/:user/:repo/releases/assets/:tag", async ({ params, __debug_log }) => {
	const url = GITHUB_REPOSITORY_RELEASE_TAG_ASSERT_URL
		.replace("${user}", params.user)
		.replace("${repo}", params.repo)
		.replace("${tag}", params.tag);

	const html = await (await doFetch(url, __debug_log)).text();
	const assertsInfo = handleAssetsInfo(html);
	if(__debug_log && __debug_log.debugFlag) assertsInfo.__debug_log = __debug_log.toString();
	return Res.jsonSuccess(assertsInfo);
});

async function doFetch(url, __debug_log) {
	if(__debug_log) __debug_log.log('fetch url:', url);
	const response = await fetch(url, {
		method: 'GET',
		headers: HEADER,
	});
	if(__debug_log) __debug_log.log('response:', await response.clone().text());
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
addEventListener('fetch', (event) => {
	initDebug(event);
	event.respondWith(router.handle(event.request)
		.catch(error => errorHandler(error, event)));
});
