import axios from 'axios';

export async function getCrawlingList(query) {
  try {
    axios.defaults.withCredentials = true;
    axios.post(`/${query}/crawl`);
  } catch (error) {
    console.log(error);
  }
}
