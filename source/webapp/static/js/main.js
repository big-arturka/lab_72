const quoteContainer = document.getElementsByClassName('quote-container')[0]
const detailContainer = document.getElementsByClassName('detail-container')[0]
const form = document.getElementsByClassName('form')[0]
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


    async function submit(event) {
        event.preventDefault()
        let url = event.target.href;
        try {
            await makeRequest(url, 'POST', {
            'text': document.getElementById('text').value,
            'author': document.getElementById('author').value,
            'email': document.getElementById('email').value
        }).then(response => response.json())
        }
        catch (error) {
             console.log(error);
        }
    }

    async function onClick(event) {
        event.preventDefault()
        if (event.target.dataset['target'] === 'main') {
            quoteContainer.className = 'quote-container'

            detailContainer.className = 'detail-container hidden'
            form.className = 'form hidden'
        } else if (event.target.dataset['target'] === 'create') {
            form.className = 'form'

            detailContainer.className = 'detail-container hidden'
            quoteContainer.className = 'quote-container hidden'
        } else {
            detailContainer.className = 'detail-container'

            quoteContainer.className = 'quote-container hidden'
            form.className = 'form hidden'

            let url = event.target.href;
            let data = await makeRequest(url, 'GET').then(response => response.json())

            let div = document.createElement('div')
            div.className = 'detail-div'

            let title = document.createElement('h2')
            title.className = 'detail-title'
            title.innerText = data.author

            let text = document.createElement('p')
            text.className = 'detail-text'
            text.innerText = data.text

            let email = document.createElement('p')
            email.className = 'detail-div'
            email.innerText = data.email

            let date = document.createElement('p')
            date.className = 'detail-date'
            date.innerText = data.created_at

            let rait = document.createElement('p')
            rait.className = 'detail-rait'
            rait.innerText = data.rating

            let status = document.createElement('p')
            status.className = 'detail-status'
            status.innerText = data.status

            div.appendChild(title)
            div.appendChild(text)
            div.appendChild(email)
            div.appendChild(date)
            div.appendChild(rait)
            div.appendChild(status)
            detailContainer.appendChild(div)
        }
    }

    let sbm = document.getElementById('submit')
    sbm.addEventListener('click', submit)
    const btns = document.getElementsByClassName('btn')
    for (btn of btns) {
        btn.addEventListener('click', onClick)
    }
}

mainPage();