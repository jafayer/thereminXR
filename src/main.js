import {load, go} from "./js/theremin.js";

async function onLoad () {
    console.log('flag');
    if(!navigator.xr && navigator.userAgent.includes('Quest')) {
        alert("Hey u suck, get a real browser");
    }

    await load();

    go();
}

window.onload = onLoad;