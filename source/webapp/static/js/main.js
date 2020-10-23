const quoteContainer = document.getElementsByClassName('quote-container')[0]
const BASE_URL = 'http://localhost:8000';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

async function makeRequest(url, method='GET', data=undefined) {
    let opts = {method, headers: {}};

    if (!csrfSafeMethod(method))
        opts.headers['X-CSRFToken'] = getCookie('csrftoken');

    if (data) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    let response = await fetch(url, opts);

    if (response.ok) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

async function mainPage() {
    let answer = await makeRequest(BASE_URL + '/api/quotes/', 'GET').then(response => response.json())
    for (let quote of answer) {
        let div = document.createElement('div')
        div.className = 'quote-div'

        let quoteText = document.createElement('p')
        quoteText.className = 'quote-text'
        quoteText.innerText = quote.text

        let quoteDate = document.createElement('p')
        quoteDate.className = 'quote-date'
        quoteDate.innerText = quote.created_at

        let quoteRait = document.createElement('p')
        quoteRait.className = 'quote-rait'
        quoteRait.innerText = quote.rating

        let quoteLink = document.createElement('a')
        quoteLink.className = 'btn btns'
        quoteLink.href = quote.url
        quoteLink.innerText = 'Подробнее'

        div.appendChild(quoteText)
        div.appendChild(quoteDate)
        div.appendChild(quoteRait)
        div.appendChild(quoteLink)
        quoteContainer.appendChild(div)
    }
    const btns = document.getElementsByClassName('btn')
    for (btn of btns) {
        btn.addEventListener('click', onClick)
    }

    async function submit(event) {
        let url = event.target.href;
        await makeRequest(url, 'POST', {
            'text': document.getElementById('text').value,
            'author': document.getElementById('author').value,
            'email': document.getElementById('email').value
        }).then(response => response.json())
    }

    async function onClick(event) {
        event.preventDefault()
        if (event.target.dataset['target'] === 'main') {
            quoteContainer.className = 'quote-container'

            let form = document.getElementsByClassName('form')[0]
            form.className = 'form hidden'
        } else if (event.target.dataset['target'] === 'create') {
            quoteContainer.className = 'hidden'

            let form = document.getElementsByClassName('form')[0]
            form.className = 'form'
            let sbm = document.getElementById('submit')
            sbm.addEventListener('click', submit)

        } else {
            let url = event.target.href;
            let data = await makeRequest(url, 'GET').then(response => response.json())
            console.log(data)
        }
    }
}

mainPage();