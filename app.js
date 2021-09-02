// DOM Selection
const inputField = document.getElementById("input-field");
const searchBtn = document.getElementById("search-btn");
const displayCard = document.getElementById("display-card");
const error = document.getElementById("error");
const item = document.getElementById("item");
const totalFound = document.getElementById("total-found");
const spinner = document.getElementById("spinner");


// common function for fetch Api
const fetchApi = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// fetch data by clicking search btn
searchBtn.addEventListener("click", () => {
    const inputValue = inputField.value.toLowerCase();

    // clear previous card
    displayCard.innerHTML = "";
    // clear previous total found book
    totalFound.innerHTML = "";

    // trun on spinner
    spinner.classList.remove("hidden");

    // validation for empty value
    if (inputValue === "") {
        error.innerHTML = `
        <p class="text-white m-12 text-center p-5 bg-red-500 rounded w-80"> ⚠️ please user enter a book name!!</p>`
        // trun off spinner if the input is value
        spinner.classList.add("hidden");
        return;
    } else {
        error.innerHTML = "";
    }

    // fetching data
    const url = `https://openlibrary.org/search.json?q=${inputValue}`
    fetchApi(url)
        .then((apiData) => {
            showCard(apiData);
        })
});

// show card function
const showCard = (data) => {
    const totalFoundResult = [];

    // trun off spinner
    spinner.classList.add("hidden");

    // validation for no result
    if (data.numFound === 0) {
        error.innerHTML = `
        <p class="text-white m-12 text-center p-5 bg-red-500 rounded w-80">your search result <span class="font-bold"> ${inputField.value} </span> can not be found !!</p>`
        return;
    }

    // showing data by forEach loop
    const dataArray = data.docs.slice(0, 30);

    dataArray.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("rounded-2xl", "border-2", "bg-white", "p-3", "h-auto");
    
        const url = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;

        div.innerHTML = ` 
        <img class="w-full h-44 mb-4 rounded-2xl" src="${url}" alt="book-thumbnail">
        <h3 class="text-xl"> <span class="font-semibold"> Name:</span> ${item.title} </h3>
        <h3 class="text-xl"> <span class="font-semibold"> Author:</span> ${item.author_name ? item.author_name.slice(0,1) : "N/A"} </h3>
        <h3 class="text-xl"> <span class="font-semibold"> Publisher:</span> ${item.publisher ? item.publisher.slice(0,1) : "N?A"} </h3>
        <h3 class="text-xl mb-6"> <span class="font-semibold">First Published:</span> ${item.first_publish_year ? item.first_publish_year : "N/A"} </h3>
        `
        displayCard.appendChild(div);

        // total found calculation
        totalFoundResult.push(item);
        totalFound.innerHTML = `
         total book found  ${totalFoundResult.length} from  ${dataArray.length}
         `
    });
};
