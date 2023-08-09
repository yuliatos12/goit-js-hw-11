import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchImages} from './pixa-bay-api';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.photo-link', { 
    captionsData: 'alt',
    captionDelay: 200,
});

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
    lightbox.refresh();

    if (data.totalHits === 0) {
        loadMoreBtn.classList.replace('load-more','is-hidden');
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
         
    } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
    }
    if(page <= 1) {
        loadMoreBtn.classList.add('is-hidden'); 
    }
    if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
    };
    
}).catch(handleError);
}
loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

function handleLoadMoreBtnClick () {
    page += 1;
    fetchImages(searchQuery, page, perPage).then(data => {
        const results = data.hits;
        const numberOfPages = Math.ceil(data.totalHits / perPage);
        if (page === numberOfPages) { 
            loadMoreBtn.classList.add('is-hidden');
            Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.removeEventListener('click', handleLoadMoreBtnClick)
        }
         gallery.insertAdjacentHTML('beforeend', createGalleryMarkUp(results)); 
         lightbox.refresh();

        
        }).catch(handleError);
       
}

function createGalleryMarkUp (results) { 
    
    const imgArr = results.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a class="photo-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
                
        <div class="info">
            <p class="info-item">
            <b>Likes <span>${likes}</span></b>
            </p>
            <p class="info-item">
            <b>Views <span>${views}</span></b>
            </p>
            <p class="info-item">
            <b>Comments <span>${comments}</span></b>
            </p>
            <p class="info-item">
            <b>Downloads <span>${downloads}</span></b>
            </p>
        </div>
        </div>`
    });
    return imgArr.join('');
   };
   function handleError() {
    Notify.failure('Something went wrong! Try reloading the page');
   }
