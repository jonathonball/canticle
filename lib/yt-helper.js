class YTHelper {

    static getStream(formats, url) {
        if (formats) {
            if (url.indexOf('youtube') != -1) {
                return formats.filter(({vcodec}) => vcodec == 'none')
                              .reduce((p, n) => (p.tbr > n.tbr) ? p : n);
            } else {
                return formats.reverse()[0];
            }
        }
        return false;
    }

}


module.exports = YTHelper;
