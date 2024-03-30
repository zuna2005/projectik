import axios from "axios"

const getTags = async (ids) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/byId`, { ids })
      const tags = response.data.sort((a, b) => a.name.localeCompare(b.name)).map(val => '#' + val.name).join(', ')
      console.log('from getTags', tags)
      return tags
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }

  const fetchItemsAndTags = async (itemsData) => {
    try {
      const tagsPromises = itemsData.map(item => getTags(item.tags));
      const tagsData = await Promise.all(tagsPromises);

      const itemsWithTags = itemsData.map((item, index) => ({
        ...item,
        tags: tagsData[index]
      }));
      return itemsWithTags
    } catch (error) {
      console.error('Error fetching items:', error);
      return []
    }
  };

  export default fetchItemsAndTags