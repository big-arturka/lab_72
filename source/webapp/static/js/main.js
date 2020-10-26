window.addEventListener('DOMContentLoaded',() => {
    const quoteContainer = $('.quote-container')[0]
    const detailContainer = $('.detail-container')[0]
    const form = $('.form')[0]
    const BASE_URL = 'http://localhost:8000/api/quotes/';

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

    async function quoteList(event) {
        event.preventDefault()
        $(quoteContainer).empty();
        let answer = await makeRequest(BASE_URL, 'GET').then(response => response.json())
        for (let quote of answer) {
            let div = $('<div></div>')
            $(div).addClass('quote-list')

            let quoteText = $('<p>')
            $(quoteText).text(`Цитата: ${quote.text}`)

            let quoteDate = $('<p>')
            $(quoteDate).text(`Создано: ${quote.created_at}`)

            let quoteRait = $('<p>')
            $(quoteRait).text(`Рейтинг: ${quote.rating}`)


            let quoteLink = $('<a>')
            $(quoteLink).attr('href', quote.url)
            $(quoteLink).addClass('btn detail')
            $(quoteLink).text('Подробнее')

            $(div).append(quoteText, quoteRait, quoteDate, quoteLink)
            $(quoteContainer).append(div)

            $(detailContainer).addClass('hidden')
            $(form).addClass('hidden')
            $(quoteContainer).removeClass('hidden')
        }
    }

    async function saveForm(event) {
        event.preventDefault()
        const text = $('#text-input')
        const author = $('#author-input')
        const email = $('#email-input')

        try {
            await makeRequest(BASE_URL, 'POST', {
                'text': $(text).val(),
                'author': $(author).val(),
                'email': $(email).val()
            }).then(response => response.json())
        }
        catch (error) {
            console.log(error);
        }
        $(text).valueOf()
        $(author).valueOf()
        $(email).valueOf()

    //    Добавить уведомление
    }

    async function quoteDetail(event) {
        event.preventDefault()

        $(detailContainer).removeClass('hidden')
        $(quoteContainer).addClass('hidden')
        $(form).addClass('hidden')

        let url = event.target.href;
        let data = await makeRequest(url, 'GET').then(response => response.json())

        let div = $('<div>')
        $(div).addClass('quote-detail')

        let title = $('<h2>')
        $(title).text(`Автор: ${data.author}`)

        let text = $('<p>')
        $(text).text(`Цитата "${data.text}"`)

        let email = $('<p>')
        $(email).text(`Почта: ${data.email}`)

        let date = $('<p>')
        $(date).text(`Создано: ${data.created_at}`)

        let rait = $('<p>')
        $(rait).text(`Рейтинг: ${data.rating}`)

        let status = $('<p>')
        $(status).text(`Статус: ${data.status}`)

        $(div).append(title, text, email, date, rait, status)
        $(detailContainer).append(div)
    }

    async function getForm(event) {
        event.preventDefault()
        $(detailContainer).addClass('hidden')
        $(quoteContainer).addClass('hidden')
        $(form).removeClass('hidden')
    }

    const homeBtn = $('#home')
    $(homeBtn).on('click', quoteList)

    const getFormBtn = $('#create')
    $(getFormBtn).on('click', getForm)

    let saveBtn = $('#submit')
    $(saveBtn).on('click', saveForm)

    let detailBtn = $('.detail')
    $(detailBtn).on('click', quoteDetail)


})