document.addEventListener("DOMContentLoaded", () => {
    let cache = {};

    // API CONFIGURATION
    const api_key = "AIzaSyBMSUkaQYuMbS1oUOn775i1eZP9RSKUt94";
    const video_http = "https://www.googleapis.com/youtube/v3/videos?";
    const channel_http = "https://www.googleapis.com/youtube/v3/channels?";
    const search_http = "https://www.googleapis.com/youtube/v3/search?";

    // DOM ELEMENTS
    const searchInput = document.querySelector(".search");
    const searchButton = document.querySelector(".search-button");
    const videoCardContainer = document.querySelector(".video-wrapper");

    // FETCH MOST POPULAR VIDEOS
    const getMostPopularVideos = () => {
        videoCardContainer.innerHTML = ""; // Clear previous results

        fetch(video_http + new URLSearchParams({
            key: api_key,
            part: "snippet",
            chart: "mostPopular",
            maxResults: 30,
            regionCode: "IN"
        }))
            .then((response) => response.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    cache["popularVideos"] = data.items;
                    data.items.forEach((video) => getChannelDetails(video));
                } else {
                    console.log("No popular videos found.");
                }
            })
            .catch((error) => console.error("Error fetching popular videos:", error));
    };

    // FETCH CHANNEL DETAILS
    const getChannelDetails = (video_data) => {
        fetch(channel_http + new URLSearchParams({
            key: api_key,
            part: "snippet",
            id: video_data.snippet.channelId
        }))
            .then((response) => response.json())
            .then((data) => {
                video_data.channelThumbnail = data.items[0]?.snippet?.thumbnails?.default?.url || "";
                createVideoCard(video_data);
            })
            .catch((error) => console.error("Error fetching channel details:", error));
    };

    // CREATE VIDEO CARD
    const createVideoCard = (video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        // console.log(video);
        videoCard.innerHTML = `
            <div class="video-content">
                <img src="${video.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail">
            </div>
            <div class="video-details">
                <div class="channel-logo">
                    <img src="${video.channelThumbnail}" alt="channelThumbnail" class="channel-icon">
                </div>
                <div class="detail">
                    <h3 class="title">${video.snippet.title}</h3>
                    <div class="channel-name">${video.snippet.channelTitle}</div>
                </div>
            </div>
        `;
        videoCardContainer.appendChild(videoCard);
    };

    // SEARCH FUNCTION
    const handleSearch = (searchVal) => {
        if (!searchVal) {
            checkCachedVideos();
            return;
        }

        videoCardContainer.innerHTML = ""; // Clear previous results

        fetch(search_http + new URLSearchParams({
            part: "snippet",
            maxResults: 25,
            q: searchVal,
            key: api_key
        }))
            .then((response) => response.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    data.items.forEach((item) => getChannelDetails(item));
                } else {
                    console.log("No results found for this search term.");
                }
            })
            .catch((error) => console.error("Error searching videos:", error));
    };

    // INITIAL LOAD OR CACHE CHECK
    const checkCachedVideos = () => {
        if (cache["popularVideos"]) {
            videoCardContainer.innerHTML = ""; // Clear container
            cache["popularVideos"].forEach((video) => createVideoCard(video));
        } else {
            getMostPopularVideos();
        }
    };

    // EVENT LISTENERS
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(searchInput.value.trim());
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            handleSearch(searchInput.value.trim());
        });
    }

    // INITIALIZE APP
    checkCachedVideos();
});
