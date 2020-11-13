"use strict";

// API variables
const redditAPI = `https://www.reddit.com/r/coronavirus/top.json`;
const guardianAPI = `https://cors-anywhere.herokuapp.com/https://content.guardianapis.com/search?order-by=newest&q=coronavirus&api-key=${guardianKey}`;
const newsApi = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?q=coronavirus&apiKey=${newsApiKey}`;

// DOM selectors
const mainContainer = document.querySelector("#main");

const articleContent = document.querySelector(".articleContent");

const articleTitle = document.querySelector("article-title");

const featuredImage = document.querySelector(".featuredImage");

const popup = document.querySelector("#popUp");
const popupContainer = document.querySelector("#popUp .container");

const feedrLogo = document.querySelector(".feedr-logo");

const guardianButton = document.querySelector("#guardian-button");
const redditButton = document.querySelector("#reddit-button");
const severalButton = document.querySelector("#several-button");

const searchButton = document.querySelector("#search");

const closeButton = document.querySelector(".closePopUp");

// shows loader
function showLoader() {
	popup.classList.add("loader");
	popup.classList.remove("hidden");
}

// hides loader
function hideLoader() {
	popup.classList.add("hidden");
}

// clears articles from main
function clearArticleList() {
	mainContainer.innerHTML = "";
}

// appendArticle takes article details and appends the new article to the list of articles
// It also ensures that when the title is clicked, the article details are displayed in a popup
function appendArticle(title, category, url, imageSrc, description) {
	// creating the holding article element
	const newArticle = document.createElement("article");
	newArticle.classList.add("article");

	// set the article contents
	newArticle.innerHTML = `
    <section class="featuredImage">
      <img src="${imageSrc}" alt="" />
    </section>
    <section class="articleContent">
      <a href="${url}" class="article-title">
        <h3>${title}</h3>
      </a>
      <h6>${category}</h6>
    </section>
    
    <div class="clearfix"></div>
  `;

	// append the new article to the list of articles
	mainContainer.appendChild(newArticle);

	// get the title element within this new article
	const titleEl = newArticle.querySelector(".article-title");

	// show the article popup when the user clicks on the title
	// also prevent the browser from loading the article URL
	titleEl.addEventListener("click", (event) => {
		event.preventDefault();
		displayPopUpContent(title, description, url);
	});
}

// shows loading spinner on page load
showLoader();

// On page load we default to News API
displayNewsAPIArticles();

// Displays Guardian articles, when dropdown is clicked
guardianButton.addEventListener("click", displayGuardianArticles);

// Displays Reddit articles, when dropdown is clicked
redditButton.addEventListener("click", displayRedditAPIArticles);

// Displays Several Sources (News API) articles, when dropdown is clicked
severalButton.addEventListener("click", displayNewsAPIArticles);

// Fetches data from News API
function displayNewsAPIArticles() {
	showLoader();
	fetch(newsApi)
		.then((response) => response.json())
		.then((data) => {
			console.log(`NewsAPI`, data);

			clearArticleList();

			hideLoader();

			// Runs a forEach loop on the fetched articles array
			// In each iteration, adds content and appends it

			data.articles.forEach((item) => {
				const title = item.title;

				const url = item.url;

				const category = item.source.name;

				const imageSrc = item.urlToImage;

				const description = item.content;

				appendArticle(title, category, url, imageSrc, description);
			});
		})
		.catch((err) => {
			console.error(err);
			alert(
				err,
				`Oops there was an error fetching data, please try again`
			);
		});
}

// Fetches data from Guardian API
function displayGuardianArticles() {
	showLoader();
	fetch(guardianAPI)
		.then((response) => response.json())
		.then((data) => {
			console.log(`Guardian`, data);

			clearArticleList();

			hideLoader();

			// Runs a forEach loop on the fetched articles array
			// In each iteration, adds content and appends it

			data.response.results.forEach((item) => {
				const { webTitle, webUrl, sectionName } = item;

				const title = webTitle;
				const category = sectionName;
				const url = webUrl;
				const imageSrc = "images/guardian-logo.jpeg";

				// Because Guardian API doesn't provide an article description, I'm repeating the title here
				const description = webTitle;

				appendArticle(title, category, url, imageSrc, description);
			});
		})
		.catch((err) => {
			console.error(err);
			alert(
				err,
				`Oops there was an error fetching data, please try again`
			);
		});
}

// Fetches data from Reddit API
function displayRedditAPIArticles() {
	showLoader();
	fetch(redditAPI)
		.then((response) => response.json())
		.then((data) => {
			console.log(`Reddit`, data);

			clearArticleList();

			hideLoader();

			// Runs a forEach loop on the fetched articles array
			// In each iteration, adds content and appends it

			data.data.children.forEach((item) => {
				const title = item.data.title;

				const url = item.data.url;

				const category = item.data.subreddit;

				const imageSrc = item.data.thumbnail;

				// Because no description is available, I'm repeating the title
				const description = item.data.title;

				appendArticle(title, category, url, imageSrc, description);
			});
		})
		.catch((err) => {
			console.error(err);
			alert(
				err,
				`Oops there was an error fetching data, please try again`
			);
		});
}

// When the user selects an article's title show the `#popUp` overlay.
// The content of the article must be inserted in the `.container` class inside `#popUp`.
// Make sure you remove the `.loader` class when toggling the articleinformation in the pop-up.
// Changes link of the "Read more from source" button to that of the respective article.
function displayPopUpContent(title, description, url) {
	// make sure it's not showing the loader
	popup.classList.remove("loader");

	// set the new article content in the popup container
	popupContainer.innerHTML = `
      <h1>${title}</h1>
      <p>
        ${description}
      </p>
      <a href="${url}" class="popUpAction" target="_blank">Read more from source</a>
  `;

	// finally, show the popup
	popup.classList.remove("hidden");
}

// Clicking the "Covid-19 News Feed" title will display the main/default feed
feedrLogo.addEventListener("click", displayNewsAPIArticles);

// When the user clicks the search icon, expand search input box
searchButton.addEventListener("click", (event) => {
	if (searchButton.className === "active") {
		searchButton.classList.remove("active");
	} else {
		searchButton.classList.add("active");
	}
});

// Hides the pop-up when user selects the "X" button on the pop-up
closeButton.addEventListener("click", (event) => {
	popup.classList.add("loader");
	hideLoader();
});