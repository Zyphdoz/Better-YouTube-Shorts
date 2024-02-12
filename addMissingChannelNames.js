setInterval(attemptToAddChannelNamesToVideos, 100);

let shorts = {
    url: document.querySelectorAll('a[href^="/shorts/"]'),
    requestedChannelName: [],

    exist() {
        return document.querySelectorAll('a[href^="/shorts/"]').length;
    },

    getUrls() {
        this.url = document.querySelectorAll('a[href^="/shorts/"]');
    },

    hasTitle(url) {
        return url.querySelector('#video-title');
    },
    
    isMissingChannelName(url) {
        return !url.querySelector('#channel-name') && !this.requestedChannelName.includes(url);
    },

    dontFetchForThisUrlAgain(url) {
        this.requestedChannelName.push(url);
    },

    appendChannelName(link, channelName) {
        const titleElement = link.querySelector('#video-title');
        const div = document.createElement('div');
        div.innerHTML = '<a id="channel-name" title="' + channelName + '"; style="color: #AAAAAA; font: 14px Roboto, Arial, sans-serif; margin: 0 -1.4px 0 0; padding: 0 -1.4px 0 0; text-decoration: none;">' + channelName + '</a>';
        titleElement.parentNode.appendChild(div);
    },

    async fetchChannelName(url) {
        const response = await fetch(url);
        const html = await response.text();
        const channelNameRegex = /"ownerChannelName":"([^"]+)"/;
        const match = html.match(channelNameRegex);
        if (match && match[1]) {
            const channelName = match[1];
            return channelName;
        } else {
            return null;
        }
    },
    
}

function attemptToAddChannelNamesToVideos() {
    if (shorts.exist()) {
        shorts.getUrls();
        for (let i = 0; i < shorts.url.length; i++) {
            const url = shorts.url[i];
            if (shorts.hasTitle(url) && shorts.isMissingChannelName(url)) {
                shorts.dontFetchForThisUrlAgain(url);
                shorts.fetchChannelName(url)
                .then(channelName => {
                    shorts.appendChannelName(url, channelName);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
        }
    }
}