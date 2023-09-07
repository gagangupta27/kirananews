import {
  DeviceEventEmitter,
  FlatList,
  NativeModules,
  SectionList,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlashList} from '@shopify/flash-list';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HeadlineCard from './src/components/HeadlineCard';

const App = () => {
  const {HeadlessTask} = NativeModules;
  const [headlines, setHeadlines] = useState([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    HeadlessTask.startHeadlessTask();
  }, []);

  useEffect(() => {
    const onStorageChange = async data => {
      let dat = await AsyncStorage.getItem('Headlines');
      dat = JSON.parse(dat);
      setHeadlines(dat);
      setTopHeadlines(dat.slice(0, 10));
    };

    const subscription = DeviceEventEmitter.addListener(
      'HeadlineUpdated',
      onStorageChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  console.log('pinned', pinnedHeadlines.length);
  console.log('top', topHeadlines.length);

  useEffect(() => {
    let interval = setInterval(() => {
      console.log('timer');
    }, timer * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const renderItem = useCallback(
    ({item, index, section}) => {
      return (
        <HeadlineCard
          item={item}
          key={item.title}
          topHeadlines={topHeadlines}
          setTopHeadlines={setTopHeadlines}
          index={index}
          pinnedHeadlines={pinnedHeadlines}
          setPinnedHeadlines={setPinnedHeadlines}
          isPinned={section.title == 'Top' ? false : true}
        />
      );
    },
    [topHeadlines, pinnedHeadlines],
  );

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', alignItems: 'flex-start'}}>
      <SectionList
        sections={[
          {
            title: 'Pinned',
            data: [...pinnedHeadlines],
          },
          {
            title: 'Top',
            data: [...topHeadlines],
          },
        ]}
        keyExtractor={(item, index) => item.title}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => <></>}
      />
    </GestureHandlerRootView>
  );
};

export default App;
