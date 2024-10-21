let api_key = "AIzaSyBMSUkaQYuMbS1oUOn775i1eZP9RSKUt94";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let search_http = "https://www.googleapis.com/youtube/v3/search?";
// let search_http = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=javascript&regionCode=IN&relevanceLanguage=en&key=[YOUR_API_KEY]"
// let channel_id = "UCDRA2X1Tp2idmQZ4-EASDEA";
// let uploads = "UUDRA2X1Tp2idmQZ4-EASDEA"
// let url = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&channelId=UCDRA2X1Tp2idmQZ4-EASDEA&maxResults=20&key=AIzaSyBMSUkaQYuMbS1oUOn775i1eZP9RSKUt94"

// Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json

// youtube data api reference: https://developers.google.com/youtube/v3/docs

const videoCardContainer = document.querySelector(".video-wrapper");


// Fetch the most popular videos
fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 30, 
    regionCode: 'IN' // Region code for filtering
}))
// ?key=YOUR_API_KEY&part=snippet&chart=mostPopular&maxResults=30&regionCode=IN
.then(response => response.json())
.then((data) => {
    data.items.forEach(video => {
        getChannelIcon(video);
    });
})
.catch(err => console.error(err));

// Function to fetch channel details
const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId // Channel ID of the video
    }))
    .then(response => response.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url; // Getting channel logo
        makeVideoCard(video_data); // Call the function to display videos
    });
    
};

// Function to display video details on the page
const makeVideoCard = (video) => {
    

    let videoCard = document.createElement('div');
    videoCard.classList.add('video');

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
    videoCardContainer.appendChild(videoCard)

};
