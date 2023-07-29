import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38533385-28515aa6f593c10148bebd9ab';

export async function fetchImages(q, page, perPage) {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  fetchImages().then(console.log);