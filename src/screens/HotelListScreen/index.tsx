/**
 * 酒店列表页
 */
import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import type {HotelListItem} from '../../types';
import {MOCK_HOTEL_LIST} from './mockHotels';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelList'>;

export function HotelListScreen({navigation, route}: Props) {
  const params = route.params ?? {};
  const {keyword, location, checkIn, checkOut, starLevel, priceRange, tags} =
    params;

  const renderItem = ({item}: {item: HotelListItem}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetail', {hotelId: item.id})}
      activeOpacity={0.7}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.price}>¥{item.price}/晚</Text>
    </TouchableOpacity>
  );

  const hasSearch = keyword || location || checkIn || tags?.length;
  const searchSummary = [
    keyword && `关键词: ${keyword}`,
    location && `地点: ${location}`,
    checkIn && checkOut && `入住 ${checkIn} 离店 ${checkOut}`,
    starLevel && `星级: ${starLevel}`,
    priceRange && `价格: ${priceRange}`,
    tags?.length ? `标签: ${tags.join('、')}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.container}>
      {hasSearch ? (
        <Text style={styles.keyword} numberOfLines={2}>
          {searchSummary}
        </Text>
      ) : null}
      <FlatList
        data={MOCK_HOTEL_LIST}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyword: {
    padding: 12,
    paddingHorizontal: 24,
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
  },
});
