browser.menus.create({
    title: browser.i18n.getMessage('bandampHelperEnqueue'),
    contexts: ['link'],
    onclick: bandampHelperEnqueue
});

function bandampHelperEnqueue(info) {
    const albumUrl = info.linkUrl;
    if (
        !albumUrl.includes('.bandcamp.com/album/')
        && !albumUrl.includes('.bandcamp.com/track/')
    ) {
        return;
    }

    browser.tabs.query({ currentWindow: true }).then((tabs) => {
        const bandampTab = tabs.find((tab) => tab.url.includes('https://bandamp.fly.dev'))
        if (!bandampTab) {
            return;
        }

        browser.tabs.executeScript(bandampTab.id, {
            code: `
                document.querySelector('.playlist-controls__album-url').value='${albumUrl}'; 
                document.querySelector('.playlist-controls__add').click();
                `
        });
    });
}
