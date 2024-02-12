setTimeout(redirectIfYouTubeShorts, 100);

function redirectIfYouTubeShorts() {
    url.current = window.location.href;
    if (url.isYouTubeShorts()){
        url.replaceShortsWithWatch();
        url.redirect();
    } else {
        setTimeout(redirectIfYouTubeShorts, 100)
    }
}

let url = {
    current: window.location.href,
    redirectedHref: '',

    replaceShortsWithWatch() {
        this.redirectedHref = this.current.replace('youtube.com/shorts/', 'youtube.com/watch?v=');
    },

    redirect() {
        window.location.href = this.redirectedHref;
    },

    isYouTubeShorts() {
        return this.current.includes('youtube.com/shorts/');
    },

}