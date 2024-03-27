const BANDAMP_URL = 'https://bandamp.fly.dev';
const TAB_STATUS = {
    loading: 'loading',
    complete: 'complete'
};

browser.menus.create({
    title: browser.i18n.getMessage('bandampHelperEnqueue'),
    contexts: ['link'],
    onclick: bandampHelperEnqueueAction
});

function bandampHelperEnqueueAction(info) {
    const albumUrl = info.linkUrl;
    if (
        !albumUrl.includes('.bandcamp.com/album/')
        && !albumUrl.includes('.bandcamp.com/track/')
    ) {
        return;
    }

    bandampHelperEnqueue(albumUrl);
}

function bandampHelperEnqueue(albumUrl) {
    browser.tabs.query({ currentWindow: true }).then((tabs) => {
        const bandampTab = tabs.find((tab) => tab.url.includes(BANDAMP_URL))
        if (bandampTab) {
            return bandampHelperExecuteScript(bandampTab.id, albumUrl);
        }

        const bandampTabLoadedListener = (tabId, changeInfo, tab) => {
            if (!tab.url.startsWith(BANDAMP_URL) || tab.status !== TAB_STATUS.complete) {
                return;
            }

            browser.tabs.onUpdated.removeListener(bandampTabLoadedListener);
            bandampHelperEnqueue(albumUrl);
        }
        browser.tabs.onUpdated.addListener(bandampTabLoadedListener);

        browser.tabs.create({
            url: BANDAMP_URL,
            active: false,
            pinned: true
        });
    });
}

function bandampHelperExecuteScript(tabId, albumUrl) {
    browser.tabs.executeScript(tabId, {
        code: `
                document.querySelector('.playlist-controls__album-url').value='${albumUrl}'; 
                document.querySelector('.playlist-controls__add').click();
                `
    });
}
