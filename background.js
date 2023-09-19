browser.menus.create({
    id: 'bandamp-enqueue',
    title: browser.i18n.getMessage('enqueue'),
    contexts: ['link']
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'bandamp-enqueue') {
        return;
    }

    const albumUrl = info.linkUrl;
    if (!albumUrl.includes('.bandcamp.com/album/')) {
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
});
