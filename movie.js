const APIURL = 'https://api.themoviedb.org/3/movie/popular?api_key=e147528034b3b1192f389af6460b3ad9&language=zh-TW&page='

    var IMGPATH = "https://image.tmdb.org/t/p/w500/";

    var movie_name = "";//search movie時的變數
    var SearchAPI = 'https://api.themoviedb.org/3/search/movie?api_key=e147528034b3b1192f389af6460b3ad9&language=zh-TW&query=';

    var ACTOR_API = 'https://api.themoviedb.org/3/movie/';

    var container = document.getElementById('container');
    var search = document.getElementById('search');
    var page = document.getElementById('page');
    var previous_page = document.getElementById('previous_page');
    var now_page = document.getElementById('now_page');
    var next_page = document.getElementById('next_page');
    var total_page = document.getElementById('total_page');
    var logo = document.getElementById('logo');
    var which_page = 1;//目前正在哪一頁的變數

    var box_click = false;//判斷電影是否被點擊
    var search_movie = false;//判斷是否在搜尋電影的頁面

    getMovie(APIURL + "1");

    async function getMovie(API) {
        const res = await fetch(API);
        const data = await res.json();
        console.log(data);
        showMovie(data.results);
    }

    async function getActor(API, box_actor) {
        const res = await fetch(API);
        const data = await res.json();
        console.log(data);
        console.log(box_actor);

        showActor(data.cast, box_actor);
    }

    /*****************************顯示所有電影**********************************/
    function showMovie(movie) {
        movie.forEach(element => {
            const movie_box = document.createElement('div');
            movie_box.className = "movie_box";
            movie_box.id = "movie_box";
            const movie_img = document.createElement("img");
            const movie_info = document.createElement("div");
            movie_info.className = "movie_info";
            const movie_title = document.createElement("div");
            const movie_vote = document.createElement("div");
            movie_title.className = "movie_title";
            movie_vote.className = "movie_vote";
            movie_img.src = IMGPATH + element.poster_path;
            movie_title.innerHTML = element.title;
            movie_vote.innerHTML = element.vote_average + "分";
            container.appendChild(movie_box);
            movie_box.appendChild(movie_img);
            movie_box.appendChild(movie_info);
            movie_info.appendChild(movie_title);
            movie_info.appendChild(movie_vote);

            movie_box.onclick = function () {
                if (box_click == false) {
                    var detail = {
                        pic: IMGPATH + element.poster_path,
                        title: element.title,
                        outline: element.overview,
                        id: element.id
                    }
                    showDetail(detail);
                    stopScroll(box_click);
                    box_click = true;
                }
                else { }
            }
        });
    }
    /*************隱藏container的scrollbar****************************/
    function stopScroll(box_click) {
        var body = document.body;
        if (!box_click) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflow = "auto";
        }
    }
    /*****************************顯示電影內容**********************************/
    function showDetail(movie) {

        const container_block = document.createElement('div');
        container_block.className = 'container_block';
        container.appendChild(container_block);
        const movie_box2 = document.createElement('div');
        movie_box2.className = "movie_box2";
        const close_box = document.createElement('div')
        close_box.className = "close_box";
        const box_img_div = document.createElement("div");
        box_img_div.className = 'box_img_div';
        const box_img = document.createElement("img");
        const box_content = document.createElement('div');
        box_content.className = "box_content";
        const box_title = document.createElement('div');
        box_title.className = 'box_title';
        const box_actor = document.createElement('div');
        box_actor.className = "box_actor"
        box_actor.id = "box_actor";
        const box_outline = document.createElement('div');
        box_outline.className = 'box_outline';

        close_box.innerHTML = "X";
        box_img.src = movie.pic;
        box_title.innerHTML = movie.title;
        box_outline.innerHTML = movie.outline;
        container.appendChild(movie_box2);
        movie_box2.appendChild(box_img_div);
        box_img_div.appendChild(box_img);
        movie_box2.appendChild(box_content);
        movie_box2.appendChild(close_box);
        box_content.appendChild(box_title);
        box_content.appendChild(box_outline);
        box_content.appendChild(box_actor);
        getActor(ACTOR_API + movie.id + '/credits?api_key=e147528034b3b1192f389af6460b3ad9&language=en-US', box_actor);

        close_box.addEventListener('click', function () {
            container.removeChild(movie_box2);
            container.removeChild(container_block);
            stopScroll(box_click);
            box_click = false;
        })

    }
    /***********************電影演員******************************************/
    function showActor(actor, box_actor) {
        for (var i = 0; i < 7; i++) {
            const actor_item = document.createElement('div');
            actor_item.className = 'actor_item';
            const actor_img = document.createElement('img');
            const actor_name = document.createElement('div');
            actor_name.className = 'actor_name';
            actor_img.src = IMGPATH + actor[i].profile_path;
            actor_name.innerHTML = actor[i].name;
            box_actor.appendChild(actor_item);
            actor_item.appendChild(actor_img);
            actor_item.appendChild(actor_name);
        }
    }
    /*******************************電影搜尋功能*********************************/

    search.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            searchMovie();
        }
    })

    function searchMovie() {
        if (search.value == '') {
            which_page = 1;
            container.innerHTML = '';
            getMovie(APIURL + which_page);
            search_movie = false;
        }
        else {
            container.innerHTML = '';
            movie_name = search.value;
            getMovie(SearchAPI + movie_name + "&page=1&include_adult=false");
            search_movie = true;
            which_page = 1;
            now_page.innerHTML = which_page;
        }
    }

    /**********************下一頁功能***************************/
    next_page.addEventListener('click', nextPage);
    previous_page.addEventListener('click', previousPage);
    next_page.innerHTML = ">";
    previous_page.innerHTML = "<";
    now_page.innerHTML = which_page;

    function nextPage() {
        if (search_movie == true) {
            which_page++;
            container.innerHTML = '';
            getMovie(SearchAPI + movie_name + "&page=" + which_page + "&include_adult=false");
            now_page.innerHTML = which_page;
        }
        else {
            which_page++;
            console.log(which_page);
            container.innerHTML = '';
            getMovie(APIURL + which_page);
            now_page.innerHTML = which_page;
        }
    }

    function previousPage() {
        if (search_movie == true) {
            if (which_page == 1) {
                which_page = 1;
            }
            else {
                which_page--;
                container.innerHTML = '';
                getMovie(SearchAPI + movie_name + "&page=" + which_page + "&include_adult=false");
                now_page.innerHTML = which_page;
            }
        }
        else {
            if (which_page == 1) {
                which_page = 1;
            }
            else {
                which_page--;
                console.log(which_page);
                container.innerHTML = '';
                getMovie(APIURL + which_page);
                now_page.innerHTML = which_page;
            }
        }
    }
    /***********logo click**********************/
    logo.addEventListener('click', function () {
        which_page = 1;
        container.innerHTML = '';
        getMovie(APIURL + which_page);
        now_page.innerHTML = which_page;
    })