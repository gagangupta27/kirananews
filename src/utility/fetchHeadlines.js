const {
  default: AsyncStorage,
} = require('@react-native-async-storage/async-storage');

import {DeviceEventEmitter} from 'react-native';
import moment from 'moment';

module.exports = async () => {
  let pageNumber = await AsyncStorage.getItem('HeadLinePageNumber');
  if (pageNumber) pageNumber++;
  else pageNumber = 1;
  const url = `https://newsapi.org/v2/top-headlines?apiKey=755923f53232462ca7be904fb29fb5e4&country=in&pageSize=15&page=${pageNumber}`;
  const options = {
    method: 'GET',
    headers: {},
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.status == 'ok') {
      await AsyncStorage.setItem('Headlines', JSON.stringify(result.articles));
      DeviceEventEmitter.emit('HeadlineUpdated', moment().valueOf());
      await AsyncStorage.setItem('HeadLinePageNumber', String(pageNumber));
    } else {
      DeviceEventEmitter.emit('HeadlineError', result);
    }
  } catch (error) {
    console.error(error);
    DeviceEventEmitter.emit('HeadlineError', moment().valueOf());
  }
};
