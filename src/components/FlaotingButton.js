import React, {memo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Clock from '../assets/Clock.svg';
import {Dimensions} from 'react-native';
import {MotiView} from 'moti';
import {TouchableOpacity} from 'react-native';

let ScreenWidth = Dimensions.get('window').width;

const FloatingButton = ({setTimerFunc = () => {}}) => {
  const [open, setOpen] = useState(false);

  const times = [
    {
      label: '10 secs',
      time: 10,
    },
    {
      label: '30 secs',
      time: 30,
    },
    {
      label: '1 min',
      time: 60,
    },
  ];

  return (
    <TouchableOpacity
      onPress={() => {
        setOpen(prev => !prev);
      }}
      activeOpacity={1}
      style={style.container}>
      <MotiView
        from={style.closeView}
        animate={open ? style.openView : style.closeView}
        transition={{type: 'timing', duration: 200}}
        style={style.motiView}>
        {!open && <Clock />}
        {open && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {times.map((timeData, index) => (
              <TouchableOpacity
                onPress={() => {
                  setTimerFunc(timeData.time);
                  setOpen(false);
                }}
                key={index}
                style={style.timerContainer}>
                <Text style={style.textStyle}>{timeData?.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </MotiView>
    </TouchableOpacity>
  );
};

const areEqual = (prevProps, nextProps) => {
  return true; // donot re-render
};

export default memo(FloatingButton, areEqual);

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  openView: {
    width: ScreenWidth - 80,
  },
  motiView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  closeView: {
    width: 20,
    height: 20,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    height: '100%',
    width: '33.33%',
  },
});
