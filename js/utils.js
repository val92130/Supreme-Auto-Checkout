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