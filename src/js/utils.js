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