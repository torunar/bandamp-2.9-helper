const BC_PLAYER_URL = 'https://torunar.github.io/bc-player';
const TAB_STATUS = {
    loading: 'loading',
    complete: 'complete'
};

browser.menus.create({
    title: browser.i18n.getMessage('bcPlayerHelperEnqueue'),
    contexts: ['link'],
    onclick: bcPlayerHelperEnqueueAction
});

function bcPlayerHelperEnqueueAction(info) {
    const albumUrl = info.linkUrl;
    if (
        !albumUrl.includes('.bandcamp.com/album/')
        && !albumUrl.includes('.bandcamp.com/track/')
    ) {
        return;
    }

    bcPlayerHelperEnqueue(albumUrl);
}

function bcPlayerHelperEnqueue(albumUrl) {
    browser.tabs.query({ currentWindow: true }).then((tabs) => {
        const bcPlayerTab = tabs.find((tab) => tab.url.includes(BC_PLAYER_URL))
        if (bcPlayerTab) {
            return bcPlayerHelperExecuteScript(bcPlayerTab.id, albumUrl);
        }

        const bcPlayerTabLoadedListener = (tabId, changeInfo, tab) => {
            if (!tab.url.startsWith(BC_PLAYER_URL) || tab.status !== TAB_STATUS.complete) {
                return;
            }

            browser.tabs.onUpdated.removeListener(bcPlayerTabLoadedListener);
            bcPlayerHelperEnqueue(albumUrl);
        }
        browser.tabs.onUpdated.addListener(bcPlayerTabLoadedListener);

        browser.tabs.create({
            url: BC_PLAYER_URL,
            active: false,
            pinned: true
        });
    });
}

function bcPlayerHelperExecuteScript(tabId, albumUrl) {
    browser.tabs.executeScript(tabId, {
        code: `
                document.querySelector('.playlist-controls__album-url').value='${albumUrl}'; 
                document.querySelector('.playlist-controls__add').click();
                `
    });
}
