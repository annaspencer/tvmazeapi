/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
   try {
    const imagePlaceholder ="http://tinyurl.com/missing-tv";
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
    let results = res.data.map(result => {
      let show = result.show;
      return{
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : imagePlaceholder,
      }
    }) 
     return results;
     } catch(e){
      alert("Invalid Search Term. Try Again");
   }
}




/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(results) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of results) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
              <img class="car-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}



$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});



async function getEpisodes(id) {

   try {
    const res2 = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
    console.log(res2)
    let results2 = res2.data.map(episode => ({
    
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
      
    }) )
     return results2;
      } catch(e){
       alert("Invalid Search Term. Try Again");
    }
}
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li> 
        ${episode.name}
          (season ${episode.season}, episode ${episode.number})
          </li>
         
         
      `);

    $episodesList.append($item);
  }
   $("#episodes-area").show();
};

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(e){
  let showId = $(e.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});

