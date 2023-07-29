import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchImages} from './pixa-bay-api';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

const {searchForm, gallery, loadMoreBtn} = refs;

const perPage = 40;
let page = 1;
let searchQuery = '';

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.classList.add( 'is-hidden');

function handleSubmit(event) {
event.preventDefault();

searchQuery = event.target.firstElementChild.value.trim();
// console.log(searchQuery);
if (!searchQuery) {
    return;
}
fetchImages(searchQuery, page, perPage).then(data => {
   const results = data.hits;
    gallery.innerHTML = createGalleryMarkUp(results);

    if (data.totalHits <= 1) {
      
         loadMoreBtn.classList.add('is-hidden');
    } else {
        loadMoreBtn.classList.remove('is-hidden');
    }
    
}).catch(console.warn);

}

function createGalleryMarkUp (results) { 
    
    const imgArr = results.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
        <div class="info">
            <p class="info-item">
            <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads ${downloads}</b>
            </p>
        </div>
        </div>`
    });
    return imgArr.join('');
   };
   
