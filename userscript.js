// ==UserScript==
// @name        download-X-bookmarks
// @namespace   Violentmonkey Scripts
// @match       https://x.com/i/bookmarks*
// @icon        https://abs.twimg.com/favicons/twitter.3.ico
// @version     1.0
// @author      bardiel73
// @description 06/03/2026, 06:15:32
// @grant       GM_download
// @connect     pbs.twimg.com
// @connect     abs.twimg.com
// ==/UserScript==
(async () => {
    let images = new Set();

    const btn = document.createElement("button");
    btn.innerHTML = "START";
    btn.style = "position:fixed;top:10px;right:150px;z-index:9999;padding:30px;background:green;color:white;cursor:pointer;";
    document.body.appendChild(btn);

    const btn2 = document.createElement("button");
    btn2.innerHTML = "END";
    btn2.style = "position:fixed;top:10px;right:30px;z-index:9999;padding:30px;background:red;color:white;cursor:pointer;";
    document.body.appendChild(btn2);

    let scrollInterval;

    btn.onclick = () => {

      scrollInterval = setInterval(() => {

            const foundImages = document.querySelectorAll('article img[src*="pbs.twimg.com/media/"]');

            foundImages.forEach(img => {
                const url = img.src.replace(/name=[^?]*/gi, "name=orig");
                if (!images.has(url)) {
                    images.add(url);
                    console.log(`Found: ${url}`);
                }
            });

            window.scrollBy(0, 1000);
        }, 500);
    };

    btn2.onclick = async () => {
            clearInterval(scrollInterval);
            const imageList = Array.from(images);
            console.log(`downloading ${imageList.length} images ...`);

            for (let i = 0; i < imageList.length; i++) {
                const url = imageList[i];
                const ext = url.match(/format=([^&]+)/i)[1];
                const name = url.match(/\/media\/([^?]+)/)[1].replace(/\.[^.]+$/i, '');
                const name_ext = `${name}.${ext}`;
                console.log(`file:${name_ext}, url:${url}`);

                GM_download({
                    url: url,
                    name: name_ext,
                    saveAs: false,
                    onerror: (err) => console.error("Download error:", err, url),
                    onload: () => {}
                });

                await new Promise(resolve => setTimeout(resolve, 500));
            }
    };

})();
