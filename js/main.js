const listsContainer = document.getElementById('listsContainer');
const btnSubmit = document.getElementById('btnSubmit');
const inputEl = document.getElementById('input');
const searchIcon = document.getElementById('icon');

inputEl.addEventListener('input', function () {
    searchIcon.src = './img/icons8-search-24-blue.png';

    if (this.value !== '') {
        this.classList.remove('invalid');
        inputEl.placeholder = 'Search at giphy';
        searchIcon.src = './img/icons8-search-24-green.png';
    }
});

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();

    const trimedValue = inputEl.value.trim();


    if (trimedValue !== '') {
        xhr.open('GET', `https://api.giphy.com/v1/gifs/search?api_key=V42P2S0Vho7IZBaPmLg04Xv6qQI1KAHz&q=${trimedValue}&limit=25&offset=0&rating=g&lang=en`, true);
        xhr.send();
        inputEl.value = '';
        searchIcon.src = './img/icons8-search-24-blue.png';
    } else {
        inputEl.placeholder = 'You can\'t leave input empty';
        inputEl.classList.add('invalid');
        searchIcon.src = './img/icons8-search-24-red.png'
    }
});


const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://api.giphy.com/v1/gifs/trending?api_key=V42P2S0Vho7IZBaPmLg04Xv6qQI1KAHz&limit=25&rating=g', true);
xhr.send();

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const parsedResponse = JSON.parse(xhr.response);
        const { meta } = parsedResponse;
        if (meta.status === 200) {
            const { data } = parsedResponse;
            setupPagination(data);
            displayToLists(data, listsContainer, 1, 4);
        }
    }
}

function setupPagination(data) {
    const paginationContainer = document.getElementById('pagination');

    cleanTheParentBlock(paginationContainer);

    let currentPage = 1;
    const itemsToShow = 4;

    const paginationItems = Math.ceil(data.length / itemsToShow);

    for (let i = 1; i <= paginationItems; i++) {
        const btn = paginationButton(i, currentPage, data, itemsToShow);

        paginationContainer.append(btn);
    }
}

function paginationButton(pageNumber, currentPage, data, itemsToShow) {
    const paginationBtn = document.createElement('div');

    paginationBtn.classList.add('pagination__item');
    paginationBtn.textContent = pageNumber;
    if (currentPage === pageNumber) { paginationBtn.classList.add('active') };

    paginationBtn.addEventListener('click', () => {
        currentPage = pageNumber;
        displayToLists(data, listsContainer, currentPage, itemsToShow);

        const activeBtn = document.querySelector('.active');
        activeBtn.classList.remove('active');

        paginationBtn.classList.add('active');
    });

    return paginationBtn;
}

function displayToLists(dataArr, parentBlock, currentPage, itemsToShow) {
    cleanTheParentBlock(listsContainer);

    const start = --currentPage * itemsToShow;
    const end = start + itemsToShow;

    const slicedData = dataArr.slice(start, end);

    for (let i = 0; i < slicedData.length; i++) {
        const { url: link } = slicedData[i].images.downsized;

        const divBody = document.createElement('div');
        divBody.classList.add('lists__body');

        const divItem = document.createElement('div');
        divItem.classList.add('lists__item');

        const aLink = document.createElement('a');
        aLink.classList.add('lists__link');
        // aLink.href = slicedData[i].embed_url; Куда-то в неизвестность :]

        const imgItem = document.createElement('img');
        imgItem.classList.add('lists__gif');
        imgItem.src = link;

        aLink.append(imgItem);
        divItem.append(aLink);
        divBody.append(divItem);
        parentBlock.append(divBody);
    }

};


function cleanTheParentBlock(parentBlock) {
    const range = new Range();
    range.selectNodeContents(parentBlock);
    range.deleteContents();
};