var referrer = document.referrer;

function guid() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
};

var track_iden = guid();

function track(data) {
    if (navigator.doNotTrack == 1) return;

    data['token'] = '9BX3wh';

    if (!data['customer_properties']) {
        data['customer_properties'] = {}
    }

    data['customer_properties']['$id'] = track_iden;
    data['customer_properties']['referrer'] = referrer;

    var url = '//127.0.0.1:8080/api/track?i=1&data=' + 
        encodeURIComponent(Base64.encode(JSON.stringify(data)));

    // Send with an image.
    var image = new Image(1, 1);
    image.src = url;
}