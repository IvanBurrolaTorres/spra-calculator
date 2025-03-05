export const saveSearch = (searchData) => {
    const history = getSearchHistory();
    history.push(searchData);
    localStorage.setItem('spraSearchHistory', JSON.stringify(history));
  };
  
  export const getSearchHistory = () => {
    const historyString = localStorage.getItem('spraSearchHistory');
    return historyString ? JSON.parse(historyString) : [];
  };
  
  export const deleteSearch = (id) => {
    const history = getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('spraSearchHistory', JSON.stringify(updatedHistory));
  };
  
  export const clearAllSearches = () => {
    localStorage.removeItem('spraSearchHistory');
  };