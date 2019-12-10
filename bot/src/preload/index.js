

function injectScript() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerText = `
    window.document.mockedQuerySelector = document.querySelector;
    window.document.mockedQuerySelectorAll = document.querySelectorAll;
    `;
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function(event) {
    injectScript();
});
