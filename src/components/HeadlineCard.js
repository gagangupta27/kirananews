import {AnimatePresence, MotiView, useDynamicAnimation} from 'moti';
import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Bookmark from '../assets/Bookmark.svg';
import Pin from '../assets/Pin.svg';
import {Swipeable} from 'react-native-gesture-handler';
import Trash from '../assets/Trash.svg';
import UnPin from '../assets/UnPin.svg';

const HEIGHT = 80;

const HeadlineCard = ({item, deleteFunc = () => {}, pinFunc = () => {}}) => {
  const [deleted, setDeleted] = useState(false);

  const leftSwipe = () => (
    <MotiView style={style.leftSwipeView}>
      <Trash />
    </MotiView>
  );

  const rightSwipe = () => (
    <MotiView style={style.rightSwipeView}>
      {item?.isPinned ? <UnPin /> : <Pin />}
    </MotiView>
  );

  return (
    <Swipeable
      onSwipeableOpen={data => {
        setDeleted(true);
        let timeout = setTimeout(async () => {
          if (data == 'left') {
            deleteFunc(item);
            item = {...item, isDeleted: true};
          } else {
            pinFunc(item);
          }
          clearTimeout(timeout);
        }, 300);
      }}
      renderRightActions={rightSwipe}
      renderLeftActions={leftSwipe}>
      <AnimatePresence>
        <MotiView
          from={{height: 0}}
          key={item?.title}
          animate={deleted ? style.deletedView : style.animateStyle}
          transition={{type: 'timing', duration: 200}}
          style={style.motiView}>
          <View style={style.viewContainer}>
            <Text style={style.textStyle}>{item?.title}</Text>
            <View style={style.pinView}>{item?.isPinned && <Bookmark />}</View>
          </View>
        </MotiView>
      </AnimatePresence>
    </Swipeable>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (JSON.stringify(prevProps?.item) == JSON.stringify(nextProps?.item)) {
    return true; // donot re-render
  }
  return false; // will re-render
};

export default memo(HeadlineCard, areEqual);

const style = StyleSheet.create({
  rightSwipeView: {
    width: '100%',
    height: HEIGHT,
    padding: 20,
    backgroundColor: 'blue',
    alignItems: 'flex-end',
  },
  leftSwipeView: {
    width: '100%',
    height: HEIGHT,
    padding: 20,
    backgroundColor: 'red',
  },
  deletedView: {
    height: 0,
    padding: 0,
    borderBottomWidth: 0,
    opacity: 0,
  },
  motiView: {
    width: '100%',
    borderColor: 'grey',
    backgroundColor: '#fff',
  },
  viewContainer: {
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
    width: '90%',
  },
  pinView: {
    width: '10%',
    alignItems: 'flex-end',
  },
  animateStyle: {
    height: HEIGHT,
    borderBottomWidth: 0.5,
    opacity: 1,
  },
});
