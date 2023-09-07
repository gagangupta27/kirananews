import {MotiView, useDynamicAnimation} from 'moti';
import React, {memo, useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {Swipeable} from 'react-native-gesture-handler';

const HeadlineCard = ({
  item,
  topHeadlines = [],
  setTopHeadlines = () => {},
  index,
  pinnedHeadlines = [],
  setPinnedHeadlines = () => {},
  isPinned = false,
}) => {
  const [deleted, setDeleted] = useState(false);

  const HEIGHT = 80;

  const leftSwipe = () => (
    <MotiView
      style={{
        width: '100%',
        height: HEIGHT,
        padding: 20,
        backgroundColor: 'red',
      }}></MotiView>
  );

  const rightSwipe = () => (
    <MotiView
      style={{
        width: '100%',
        height: HEIGHT,
        padding: 20,
        backgroundColor: 'blue',
      }}></MotiView>
  );

  console.log(index);

  return (
    <Swipeable
      onSwipeableOpen={data => {
        if (data == 'left') {
          setDeleted(true);
          if (isPinned) {
            let timeout = setTimeout(async () => {
              let tempPinnedHeadlines = [...pinnedHeadlines];
              tempPinnedHeadlines.splice(index, 1);
              setPinnedHeadlines(tempPinnedHeadlines);
              clearTimeout(timeout);
            }, 300);
          } else {
            let timeout = setTimeout(async () => {
              let tempTopHeadlines = [...topHeadlines];
              tempTopHeadlines.splice(index, 1);
              setTopHeadlines(tempTopHeadlines);
              clearTimeout(timeout);
            }, 300);
          }
        } else {
          setDeleted(true);
          if (isPinned) {
            console.log('noooooooo');
            let timeout = setTimeout(async () => {
              let tempPinnedHeadlines = [...pinnedHeadlines];
              tempPinnedHeadlines.splice(index, 1);
              setPinnedHeadlines(tempPinnedHeadlines);

              let tempTopHeadlines = [...topHeadlines];
              tempTopHeadlines.push(item);
              setTopHeadlines(tempTopHeadlines);
              clearTimeout(timeout);
            }, 300);
          } else {
            console.log('yyyyyy');
            let timeout = setTimeout(async () => {
              let tempPinnedHeadlines = [...pinnedHeadlines];
              tempPinnedHeadlines.push(item);
              setPinnedHeadlines(tempPinnedHeadlines);

              let tempTopHeadlines = [...topHeadlines];
              tempTopHeadlines.splice(index, 1);
              setTopHeadlines(tempTopHeadlines);
              clearTimeout(timeout);
            }, 300);
          }
        }
      }}
      renderRightActions={rightSwipe}
      renderLeftActions={leftSwipe}>
      <MotiView
        from={{height: HEIGHT}}
        animate={deleted ? {height: 0, padding: 0, borderBottomWidth: 0} : {}}
        transition={{type: 'timing', duration: 200}}
        style={{
          width: '100%',
          padding: 20,
          borderBottomWidth: 0.5,
          borderColor: 'grey',
          backgroundColor: '#fff',
        }}>
        <Text style={{color: 'black'}}>{item?.title}</Text>
      </MotiView>
    </Swipeable>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (
    JSON.stringify(prevProps.item) == JSON.stringify(nextProps.item) &&
    prevProps.index == nextProps.index &&
    prevProps.isPinned == nextProps.isPinned
  ) {
    return true; // donot re-render
  }
  return false; // will re-render
};

export default memo(HeadlineCard, areEqual);
