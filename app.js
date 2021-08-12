// ******************************************************************************************
// GLOBAL VARIABLE
// ******************************************************************************************
let keywordByUser = document.querySelector("#keyword-by-user")
let currKeyword = ""
const videoBySearch = document.querySelector(".result-container")
// ******************************************************************************************
// part1: searching for a movie
// after pressing the SEARCH button, the website should clear the text box 
// and search the dailymotion.com API for videos
// ******************************************************************************************
const enterKeywordByUser = (event) => {
    currKeyword = keywordByUser.value
    if (event.keyCode === 13) {
        pressedSearchButton()        
    }
    return currKeyword
}
const pressedSearchButton = () => {
    const divErrorMessage = document.querySelector("#searching-error-message")
    if (currKeyword === "") {
        videoBySearch.innerHTML=""
        // user doesn't put any keyword in the search box        
        divErrorMessage.innerHTML = `
            <p>Sorry, you must enter a keyword</p>
        `
    }
    else {        
        divErrorMessage.innerHTML =""
        videoBySearch.innerHTML=""
        // if user puts a keyword, go the website and find videos matched
        fetch(`https://api.dailymotion.com/videos?fields=id%2Cthumbnail_360_url%2Ccreated_time%2Cviews_total%2Ctitle%2Cowner.username%2cowner.avatar_80_url&search=${keywordByUser.value}`)
        .then(
        (response) => {
            //console.log("Data is received from the API")
            //console.log(response)
            //console.log("Attempting to convert data to JSON")
            return response.json()
        }
        )
        .then(
        (jsonData) => {
            //console.log("Conversion success! Outputting JSON object: ")
            // console.log(jsonData)   
            
            // collecting idPosted to use when user clicks specific video.
            let arrOfIdPosted = []

            for (let i = 0; i < jsonData.list.length; i++) {
                // console.log(jsonData.list[i])
                // needed data: thumbnail, tile, owner.avatar, owner.username, date posted, views
                const idPosted = jsonData.list[i]["id"]
                const thumbnailPosted = jsonData.list[i]["thumbnail_360_url"]
                const titlePosted = jsonData.list[i]["title"]
                const userAvatarPosted = jsonData.list[i]["owner.avatar_80_url"]
                const UsernamePosted = jsonData.list[i]["owner.username"]
                const viewsPosted = jsonData.list[i]["views_total"]
                // // converting a Unix timestamp to a Date
                const unixTimeStamp = jsonData.list[i]["created_time"]
                const milliseconds = unixTimeStamp * 1000
                const dateObject = new Date(milliseconds)
                // date Posted sample: November 3, 2017
                const month = dateObject.toLocaleString("en-US", {month: "long"})
                const day = dateObject.toLocaleString("en-US", {day: "numeric"})
                const year = dateObject.toLocaleString("en-US", {year: "numeric"})
                const datePosted = `${month} ${day}, ${year}`

                // title to link the Daily Motion webpage
                arrOfIdPosted += idPosted+','
                arrOfIdConvertToChar = arrOfIdPosted.split(',')                               
                // console.log(arrOfIdConvertToChar)

                // with selected data, display results of the search
                videoBySearch.innerHTML += `
                    <div class="video-by-search">                        
                        <img id="thumbnail" src="${thumbnailPosted}"></img>
                        <h3 id="title-posted">${titlePosted}</h3>
                        <img id="user-avatar-posted" src="${userAvatarPosted}" alt="${UsernamePosted}">
                        <span id="username-posted">${UsernamePosted}</span><br>
                        <span id="date-views-posted">Date Posted: ${datePosted} | Views: ${viewsPosted}</span>
                    </div>
                `
                // ******************************************************************************************
                // * Navigate the user to the video's page in new tab
                // ******************************************************************************************
                const clickedVideoName = (event) => {
                    if (event.target.tagName.toLowerCase() === "h3") {
                        for(let i = 0; i < arrOfIdConvertToChar.length-1; i++) {
                            if (idPosted === arrOfIdConvertToChar[i] && titlePosted === event.target.innerHTML) {
                                window.open(
                                         `https://www.dailymotion.com/video/${idPosted}`, "_blank"
                                    )
                            }
                        }
                    }
                }
                // event handler: when user clicks specific video's title, open its webpage in new tab
                document.querySelector(".result-container").addEventListener("click", clickedVideoName)
            }
        }
        )
        .catch(
        (err) => {
            console.log(err)
        }
        )
    }  
    // after pressing the Search button, the website should clear the text box
    currKeyword = ""   
}
// ******************************************************************************************
// * Manipulate Search & Upload Video (nav menu)
// ******************************************************************************************
const visibleSearchBox = document.querySelector("#search-box")
const visibleForm = document.querySelector("#form-style")
const clickedNavSearch = () => {
    // - if search box is not shown (hidden), display it
    if (visibleSearchBox.classList.contains("hidden")){
        visibleSearchBox.classList.remove("hidden")
        visibleForm.classList.add("hidden")
    }
    else {
        // already display search box
        videoBySearch.innerHTML=""
        currKeyword = "" 
    }
}
const clickedNavUpload = () => {
    if(visibleForm.classList.contains("hidden")) {
        visibleForm.classList.remove("hidden")
        visibleSearchBox.classList.add("hidden")
    }
}
// ******************************************************************************************
// * Event Handlers
// ******************************************************************************************
// when user enters 'enter key', go search
document.querySelector("#keyword-by-user").addEventListener("keypress", enterKeywordByUser)
// when user clicks search button, try to find matched videos
document.querySelector("#btn-search").addEventListener("click", pressedSearchButton)
// when user clicks the search in the nav, display search box
document.querySelector("#btn-nav-search").addEventListener("click", clickedNavSearch)
// when user clicks the upload video in the nav, display form
document.querySelector("#btn-nav-upload").addEventListener("click", clickedNavUpload)

