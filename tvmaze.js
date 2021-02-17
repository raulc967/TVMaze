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
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  let res = await $.get(`http://api.tvmaze.com/search/shows?q=${query}`, (data) => {});
  return res;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button class="btn btn-primary show-episodes">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let res = await $.get(`http://api.tvmaze.com/shows/${id}/episodes`, (data) => {});
  let response = res.map((value, index, arr) => {
    return  [value.id, value.name, value.season, value.number]; 
  });
  populateEpisodes(response);

  return response;
}

$("#shows-list").on("click", ".show-episodes", async function handleEpisodeClick(e) {
  let target = $(e.target).parent().parent();
  let id = target[0].dataset.showId;
  getEpisodes(id);
});

function populateEpisodes(episodes) {
  $('#episodes-area').attr('style', 'display: block');
  const section = $('#episodes-list');
  section.empty();
  for (let episode of episodes) {
    let addition = $(`
      <li class="list-group-item">Episode Id = ${episode[0]} / Episode Name = ${episode[1]} / Season = ${episode[2]} / Episode Number = ${episode[3]}</li>
    `);
    section.append(addition);
  }
}
