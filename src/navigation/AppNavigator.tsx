/**
 * 根 Stack 导航：酒店查询 → 酒店列表 → 酒店详情
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {HomeScreen} from '../screens/HomeScreen';
import {HotelListScreen} from '../screens/HotelListScreen';
import {HotelDetailScreen} from '../screens/HotelDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor: '#0a7ea4'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: '600', fontSize: 17},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '酒店查询'}}
      />
      <Stack.Screen
        name="HotelList"
        component={HotelListScreen}
        options={{title: '酒店列表'}}
      />
      <Stack.Screen
        name="HotelDetail"
        component={HotelDetailScreen}
        options={{title: '酒店详情'}}
      />
    </Stack.Navigator>
  );
}
