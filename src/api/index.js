import axios from 'axios';

// export async function getSomething() {
//   try {
//     const { data } = await axios.get('/api');
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

export async function getAllLinks() {
  try {
    const { data } = await axios.get(`/api/links`);

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLinksByTagName(tagName) {
  try {
    const { data } = await axios.get(`/api/tag/${tagName}/links`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addLinkAndTag(link, comment, tag) {
  try {
    const payload = { link: link, comment: comment, tag: tag };
    const { data } = await axios.post(`/api/links`, payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateLinkAndTag(id, comment, tag, addToCount) {
  try {
    const payload = { comment: comment, tag: tag, addToCount: addToCount };
    const { data } = await axios.patch(`/api/links/${id}`, payload);

    return data;
  } catch (error) {
    throw error;
  }
}
