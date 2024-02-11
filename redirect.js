setTimeout(redirectIfYouTubeShorts, 100);
setTimeout(attemptToAddChannelNamesToVideos, 100);

let url = {
    current: window.location.href,
    redirectedHref: '',

    replaceShortsWithV() {
        this.redirectedHref = this.current.replace('youtube.com/shorts/', 'youtube.com/v/');
    },

    redirect() {
        window.location.href = this.redirectedHref;
    },

    isYouTubeShorts() {
        return this.current.includes('youtube.com/shorts/');
    },
    
}

function redirectIfYouTubeShorts() {
    url.current = window.location.href;
    if (url.isYouTubeShorts()){
        url.replaceShortsWithV();
        url.redirect();
    } else {
        setTimeout(redirectIfYouTubeShorts, 100)
    }
}

function attemptToAddChannelNamesToVideos() {
    if (shortLinksAreAvailable()) {
        addUploaderNameToShortsOnMainPage();
    } else {
        setTimeout(attemptToAddChannelNamesToVideos, 100);
    }
}

function addUploaderNameToShortsOnMainPage() {
    
    const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');

    for (let i = 0; i < shortsLinks.length; i++) {
        if (hasTitle(shortsLinks[i])){
            getChannelNameFromShortsLink(shortsLinks[i])
            .then(channelName => {
                appendChannelNameToDOM(shortsLinks[i], channelName);
            })
            .catch(error => {
                console.error("Error:", error);
            })
        }
    }

    function appendChannelNameToDOM(link, channelName) {
        const titleElement = link.querySelector('#video-title');
        const div = document.createElement('div');
        div.innerHTML = '<a id="channel-name" title="' + channelName + '"; style="color: #AAAAAA; font: 14px Roboto, Arial, sans-serif; margin: 0 -1.4px 0 0; padding: 0 -1.4px 0 0; text-decoration: none;">' + channelName + '</a>';
        titleElement.parentNode.appendChild(div);
    }

    function hasTitle(link) {
        return link.querySelector('#video-title')
    }
}

async function getChannelNameFromShortsLink(link) {
    const response = await fetch(link);
    const html = await response.text();
    console.log(html);
    const channelNameRegex = /"ownerChannelName":"([^"]+)"/;
    const match = html.match(channelNameRegex);
    if (match && match[1]) {
        const channelName = match[1];
        return channelName;
    } else {
        return null;
    }
}

function shortLinksAreAvailable() {
    return document.querySelectorAll('a[href^="/shorts/"]').length;
}