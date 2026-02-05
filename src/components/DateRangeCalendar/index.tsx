/**
 * 入住/离店日期范围选择日历（弹窗）- 中文，瀑布流多月垂直滚动
 */
import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {CalendarList, type DateData} from 'react-native-calendars';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_MAX_HEIGHT = Math.min(WINDOW_HEIGHT * 0.52, 420);
const CALENDAR_AREA_HEIGHT = Math.min(WINDOW_HEIGHT * 0.44, 360);
const MONTH_ITEM_HEIGHT = 320;

// 注册中文 locale（react-native-calendars 底层使用 xdate）
const ZH_LOCALE = {
  monthNames: [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ],
  monthNamesShort: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ],
  dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  amDesignator: '上午',
  pmDesignator: '下午',
};

const XDate = require('xdate') as {
  defaultLocale: string;
  locales: Record<string, typeof ZH_LOCALE>;
};
if (XDate.locales) {
  XDate.locales['zh'] = ZH_LOCALE;
  XDate.defaultLocale = 'zh';
}

const THEME = {
  todayTextColor: '#0a7ea4',
  selectedDayBackgroundColor: '#0a7ea4',
  selectedDayTextColor: '#fff',
  arrowColor: '#0a7ea4',
  monthTextColor: '#333',
  textDayHeaderFontWeight: '600' as const,
  textMonthFontWeight: '600' as const,
};

/** 只高亮入住、离店两个日期（不连成区间） */
function getMarkedDatesOnlyStartEnd(
  checkIn: string,
  checkOut: string | null,
): Record<string, {selected?: boolean; selectedColor?: string; selectedTextColor?: string}> {
  const marked: Record<
    string,
    {selected?: boolean; selectedColor?: string; selectedTextColor?: string}
  > = {};
  const item = {
    selected: true,
    selectedColor: '#0a7ea4',
    selectedTextColor: '#fff',
  };
  marked[checkIn] = item;
  if (checkOut && checkOut !== checkIn) {
    marked[checkOut] = { ...item };
  }
  return marked;
}

export type DateRangeCalendarProps = {
  visible: boolean;
  onClose: () => void;
  checkIn: string | null;
  checkOut: string | null;
  onSelect: (checkIn: string | null, checkOut: string | null) => void;
  minDate?: string;
  title?: string;
};

export function DateRangeCalendar({
  visible,
  onClose,
  checkIn,
  checkOut,
  onSelect,
  minDate,
  title = '选择入住与离店日期',
}: DateRangeCalendarProps) {
  const min = minDate ?? new Date().toISOString().slice(0, 10);

  const markedDates = useMemo(() => {
    if (!checkIn) return {};
    return getMarkedDatesOnlyStartEnd(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const onDayPress = (day: DateData) => {
    const date = day.dateString;
    if (!checkIn) {
      onSelect(date, null);
      return;
    }
    if (!checkOut) {
      if (date < checkIn) {
        onSelect(date, null);
      } else if (date === checkIn) {
        onSelect(checkIn, null);
      } else {
        onSelect(checkIn, date);
      }
      return;
    }
    onSelect(date, null);
  };

  const startDate = checkIn ?? min;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayHitSlop} />
        </TouchableWithoutFeedback>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.confirm}>确定</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.calendarWrap, {height: CALENDAR_AREA_HEIGHT}]}>
            <CalendarList
              current={startDate}
              minDate={min}
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={THEME}
              firstDay={1}
              pastScrollRange={0}
              futureScrollRange={12}
              calendarHeight={MONTH_ITEM_HEIGHT}
              calendarStyle={styles.calendarItem}
              showScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  overlayHitSlop: {
    ...StyleSheet.absoluteFillObject,
  },
  box: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: MODAL_MAX_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  confirm: {
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  calendarWrap: {
    marginTop: 8,
  },
  calendarItem: {
    marginBottom: 0,
  },
});
