/**
 * 酒店详情页
 */
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelDetail'>;

export function HotelDetailScreen({route}: Props) {
  const {hotelId} = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>酒店详情</Text>
      <Text style={styles.id}>酒店 ID: {hotelId}</Text>
      <Text style={styles.placeholder}>
        此处展示房型、设施、评价等，后续接入接口与 UI。
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  id: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
  },
});
