import {
  DeviceEventEmitter,
  NativeModules,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import FlaotingButton from './src/components/FlaotingButton';
import HeadlineCard from './src/components/HeadlineCard';

const App = () => {
  const {HeadlessTask} = NativeModules;
  const [headlines, setHeadlines] = useState([]);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [timer, setTimer] = useState(30);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      let dat = await AsyncStorage.getItem('Headlines');
      dat = JSON.parse(dat);
      if (dat && dat.length > 0) {
        setHeadlines(dat);
      } else {
        HeadlessTask.startHeadlessTask();
      }
    })();
  }, []);

  useEffect(() => {
    const onStorageChange = async data => {
      let dat = await AsyncStorage.getItem('Headlines');
      dat = JSON.parse(dat);
      setHeadlines(dat);
    };

    const subscription = DeviceEventEmitter.addListener(
      'HeadlineUpdated',
      onStorageChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (
        headlines &&
        topHeadlines &&
        headlines.length > 0 &&
        topHeadlines.length == 0
      ) {
        let tempTopHeadlines = JSON.parse(
          await AsyncStorage.getItem('topHeadLines'),
        );

        if (tempTopHeadlines && tempTopHeadlines.length > 0) {
          let dataFromAllHeadlines = [...headlines].slice(
            0,
            10 - tempTopHeadlines.length,
          );
          setTopHeadlines([...tempTopHeadlines, ...[...dataFromAllHeadlines]]);
          let tempHeadlinesAfterRemovingData = [...headlines].slice(
            10 - tempTopHeadlines.length,
          );
          setHeadlines(tempHeadlinesAfterRemovingData);
          AsyncStorage.setItem(
            'Headlines',
            JSON.stringify(tempHeadlinesAfterRemovingData),
          );
        } else {
          let dataFromAllHeadlines = [...headlines].slice(0, 10);
          setTopHeadlines([...dataFromAllHeadlines]);
          let tempHeadlinesAfterRemovingData = [...headlines].slice(10);
          setHeadlines(tempHeadlinesAfterRemovingData);
          AsyncStorage.setItem(
            'Headlines',
            JSON.stringify(tempHeadlinesAfterRemovingData),
          );
        }
      }
    })();
  }, [topHeadlines, headlines]);

  useEffect(() => {
    if (topHeadlines && topHeadlines.length) {
      AsyncStorage.setItem('topHeadLines', JSON.stringify(topHeadlines));
    }
  }, [topHeadlines]);

  useEffect(() => {
    let interval;
    if (refreshing) {
      addHeadlines(interval);
    } else {
      interval = setInterval(() => {
        addHeadlines(interval);
      }, timer * 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer, headlines, refreshing]);

  const addHeadlines = async interval => {
    if (headlines && headlines.length > 0) {
      setTopHeadlines(prevData => {
        let pinned = prevData.filter(id => id?.isPinned);
        let unPinned = prevData.filter(id => !id?.isPinned);
        return [...pinned, ...[...headlines].slice(0, 5), ...unPinned];
      });
      setRefreshing(false);
      let tempHeadlines = [...headlines].slice(5);
      setHeadlines(tempHeadlines);
      await AsyncStorage.setItem(
        'Headlines',
        JSON.stringify([...headlines].slice(5)),
      );
      if (tempHeadlines.length == 0) {
        HeadlessTask.startHeadlessTask();
      }
    } else {
      HeadlessTask.startHeadlessTask();
      clearInterval(interval);
      setRefreshing(false);
    }
  };

  console.log(
    'pinned',
    topHeadlines.filter(item => item?.isPinned == true).length,
  );
  console.log('top', topHeadlines.filter(item => !item?.isPinned).length);

  const deleteFunc = useCallback(item => {
    setTopHeadlines(prevData =>
      prevData.filter(id => {
        if (id?.title != item.title) {
          return id;
        }
      }),
    );
  }, []);

  const pinFunc = useCallback(item => {
    if (item?.isPinned) {
      setTopHeadlines(prevData =>
        prevData.map(id => {
          if (id?.title == item.title) {
            return {...item, isPinned: false};
          }
          return id;
        }),
      );
    } else {
      setTopHeadlines(prevData =>
        prevData.map(id => {
          if (id?.title == item.title) {
            return {...item, isPinned: true};
          }
          return id;
        }),
      );
    }
  }, []);

  const setTimerFunc = useCallback(time => {
    setTimer(time);
  }, []);

  const renderItem = useCallback(({item, index, section}) => {
    return (
      <HeadlineCard
        item={item}
        key={item.title}
        deleteFunc={deleteFunc}
        pinFunc={pinFunc}
      />
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'flex-start'}}>
      <SectionList
        sections={[
          {
            title: 'Pinned',
            data: topHeadlines.filter(id => id?.isPinned),
          },
          {
            title: 'Top',
            data: topHeadlines.filter(id => !id?.isPinned),
          },
        ]}
        keyExtractor={(item, index) => item.title}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => <></>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
      <FlaotingButton setTimerFunc={setTimerFunc} />
    </View>
  );
};

export default App;
