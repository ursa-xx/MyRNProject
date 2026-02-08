/**
 * 酒店查询页（首页）
 * 功能：顶部 Banner、当前地点（支持定位）、关键字、入住/离店日期（日历）、筛选、快捷标签、查询按钮
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import {DateRangeCalendar} from '../../components';
import {HomeBanner} from './components';
import {BANNER_HOTEL_ID, QUICK_TAGS, STAR_OPTIONS, PRICE_OPTIONS} from './constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({navigation}: Props) {
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [starLevel, setStarLevel] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const onBannerPagePress = () => {
    navigation.navigate('HotelDetail', {hotelId: BANNER_HOTEL_ID});
  };

  const onUseLocation = () => {
    setLocation('北京市'); // 模拟定位，后续接真实定位
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const openCalendar = () => setCalendarVisible(true);
  const closeCalendar = () => setCalendarVisible(false);
  const handleDateSelect = (inDate: string | null, outDate: string | null) => {
    setCheckIn(inDate);
    setCheckOut(outDate);
  };

  const handleSearch = () => {
    navigation.navigate('HotelList', {
      keyword: keyword.trim() || undefined,
      location: location.trim() || undefined,
      checkIn: checkIn ?? undefined,
      checkOut: checkOut ?? undefined,
      starLevel: starLevel ?? undefined,
      priceRange: priceRange ?? undefined,
      tags: selectedTags.length ? selectedTags : undefined,
    });
  };

  const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const formatDateParts = (ymd: string) => {
    const [y, m, d] = ymd.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const weekday = WEEKDAYS[date.getDay()];
    return { month: m, day: d, weekday };
  };

  const getNights = (start: string, end: string) => {
    const a = new Date(start).getTime();
    const b = new Date(end).getTime();
    return Math.max(0, Math.round((b - a) / (24 * 60 * 60 * 1000)));
  };

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* 广告区从屏幕最顶开始，总高 = 状态栏高 + 140，图片铺满整块，与灵动岛上方连为一体且面积不变 */}
      <HomeBanner topInset={insets.top} onPagePress={onBannerPagePress} />

      {/* 核心查询区域 */}
      <View style={styles.card}>
        {/* 当前地点 + 定位 */}
        <View style={styles.row}>
          <Text style={styles.label}>当前地点</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入或选择当前地点"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.locationBtn} onPress={onUseLocation}>
            <Text style={styles.locationBtnText}>定位</Text>
          </TouchableOpacity>
        </View>

        {/* 关键字 */}
        <View style={styles.row}>
          <Text style={styles.label}>关键字</Text>
          <TextInput
            style={[styles.input, styles.inputFull]}
            placeholder="位置/品牌/酒店"
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>

        {/* 入住/离店日期：点击打开日历，日期用分段样式（数字加粗、星期小字、共X晚） */}
        <TouchableOpacity style={styles.dateRowWrap} onPress={openCalendar}>
          <View style={styles.dateValueWrap}>
            {!checkIn ? (
              <Text style={styles.datePlaceholder}>请选择入住与离店日期</Text>
            ) : (
              <>
                <View style={styles.datePart}>
                  <Text style={styles.dateMonth}>{formatDateParts(checkIn).month}月</Text>
                  <Text style={styles.dateDay}>{formatDateParts(checkIn).day}</Text>
                  <Text style={styles.dateDaySuffix}>日 </Text>
                  <Text style={styles.dateWeekday}>{formatDateParts(checkIn).weekday}</Text>
                </View>
                <Text style={styles.dateSep}> — </Text>
                {checkOut ? (
                  <>
                    <View style={styles.datePart}>
                      <Text style={styles.dateMonth}>{formatDateParts(checkOut).month}月</Text>
                      <Text style={styles.dateDay}>{formatDateParts(checkOut).day}</Text>
                      <Text style={styles.dateDaySuffix}>日 </Text>
                      <Text style={styles.dateWeekday}>{formatDateParts(checkOut).weekday}</Text>
                    </View>
                    <View style={styles.dateNightsWrap}>
                      <Text style={styles.dateNights}>共{getNights(checkIn, checkOut)}晚</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.datePlaceholder}>请选离店</Text>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* 筛选：星级、价格 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>筛选条件</Text>
          <View style={styles.chipRow}>
            {STAR_OPTIONS.map(({label, value}) => (
              <TouchableOpacity
                key={value}
                style={[styles.chip, starLevel === value && styles.chipActive]}
                onPress={() => setStarLevel(prev => (prev === value ? null : value))}>
                <Text style={[styles.chipText, starLevel === value && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chipRow}>
            {PRICE_OPTIONS.map(({label, value}) => (
              <TouchableOpacity
                key={value}
                style={[styles.chip, priceRange === value && styles.chipActive]}
                onPress={() => setPriceRange(prev => (prev === value ? null : value))}>
                <Text style={[styles.chipText, priceRange === value && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 快捷标签 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷标签</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContent}>
            {(QUICK_TAGS as readonly string[]).map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                onPress={() => toggleTag(tag)}>
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 查询按钮 */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>查询</Text>
        </TouchableOpacity>
      </View>

      <DateRangeCalendar
        visible={calendarVisible}
        onClose={closeCalendar}
        checkIn={checkIn}
        checkOut={checkOut}
        onSelect={handleDateSelect}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    paddingBottom: 32,
  },
  card: {
    marginHorizontal: 16,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 72,
    fontSize: 14,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  inputFull: {
    flex: 1,
  },
  locationBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  locationBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  dateLabel: {
    width: 72,
    fontSize: 14,
    color: '#333',
  },
  dateValueWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  datePart: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dateMonth: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dateDaySuffix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dateWeekday: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  dateSep: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 2,
  },
  dateNightsWrap: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateNights: {
    fontSize: 14,
    color: '#666',
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
  },
  chipActive: {
    backgroundColor: '#0a7ea4',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
  },
  tagsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
  },
  tagActive: {
    backgroundColor: '#0a7ea4',
  },
  tagText: {
    fontSize: 13,
    color: '#666',
  },
  tagTextActive: {
    color: '#fff',
  },
  searchBtn: {
    height: 48,
    marginTop: 20,
    marginHorizontal: 0,
    borderRadius: 10,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
