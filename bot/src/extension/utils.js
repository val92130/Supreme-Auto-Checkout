function success(msg) {
    $.notify(msg, 'success');
}

function error(msg) {
    $.notify(msg, 'error');
}

function info(msg) {
    $.notify(msg, 'info');
}

function warn(msg) {
    $.notify(msg, 'warn');
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}


function match(keyword, name) {
    keyword = keyword.replace(/\s/g, "");
    name = name.replace(/\s/g, "");

    var re = new RegExp(keyword);
    return keyword.toLowerCase() === name.toLowerCase() || re.test(name);
}

function removeDuplicatesBy(keyFn, array) {
    var mySet = new Set();
    return array.filter(function(x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
}

function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}