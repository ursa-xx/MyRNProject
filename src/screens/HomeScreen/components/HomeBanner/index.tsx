/**
 * 首页顶部 Banner：8 页横向滚动，右下角圆点指示器，每 3 秒自动换页，悬停/触摸时暂停
 */
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';

const PAGE_COUNT = 8;

/** assets 下 8 张 Banner 图，与 8 页一一对应（HomeBanner 在 src/.../components/HomeBanner，需回退 4 层到 src/assets） */
const BANNER_IMAGES: ImageSourcePropType[] = [
  require('../../../../assets/0c40cc52cdea8bf588bfa1217df1a30f.jpg'),
  require('../../../../assets/1f5fe7748dacca130b066f7176db3992.jpg'),
  require('../../../../assets/88403195b0830bd40c73d9f5cb213f52.jpg'),
  require('../../../../assets/a02a6b0f175ddfa34aca21abf04b6e2e.jpg'),
  require('../../../../assets/b36b9c7c3718fb4aa87ab27c2a8cd32b.jpg'),
  require('../../../../assets/b81178921b5140cecc5f3c877ddba62a.jpg'),
  require('../../../../assets/ef00d57d27b07a283e336ceb3a85f7ed.jpg'),
  require('../../../../assets/fd2e8d22fe4143e7c67314dd6d95c6bb.jpg'),
];
const TOTAL_SLIDES = PAGE_COUNT + 1; // 多一页作为“第一页”的副本，实现最后一页左滑进第一页
const BANNER_HEIGHT = 140;
const AUTO_PLAY_INTERVAL = 3000;

export type HomeBannerProps = {
  /** 顶部安全区高度（状态栏/灵动岛），Banner 会延伸上去与之一体 */
  topInset?: number;
  onPagePress?: (index: number) => void;
};

export function HomeBanner({topInset = 0, onPagePress}: HomeBannerProps) {
  const bannerHeight = BANNER_HEIGHT + topInset;
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const goToPageRef = useRef<(index: number) => void>(() => {});

  currentIndexRef.current = currentIndex;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const {width} = e.nativeEvent.layout;
    if (width > 0) setLayoutWidth(width);
  }, []);

  const snapToFirstIfNeeded = useCallback(
    (x: number) => {
      const index = Math.round(x / layoutWidth);
      if (index === PAGE_COUNT) {
        scrollRef.current?.scrollTo({x: 0, animated: false});
        setCurrentIndex(0);
      } else if (index >= 0 && index < PAGE_COUNT) {
        setCurrentIndex(index);
      }
    },
    [layoutWidth],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (layoutWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / layoutWidth);
      if (index === PAGE_COUNT) {
        setCurrentIndex(0);
      } else if (index >= 0 && index < PAGE_COUNT && index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [layoutWidth, currentIndex],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (layoutWidth <= 0) return;
      snapToFirstIfNeeded(e.nativeEvent.contentOffset.x);
    },
    [layoutWidth, snapToFirstIfNeeded],
  );

  const goToPage = useCallback(
    (index: number) => {
      if (layoutWidth <= 0 || index < 0 || index >= PAGE_COUNT) return;
      scrollRef.current?.scrollTo({
        x: index * layoutWidth,
        animated: true,
      });
      setCurrentIndex(index);
    },
    [layoutWidth],
  );

  goToPageRef.current = goToPage;

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const next = (currentIndexRef.current + 1) % PAGE_COUNT;
      goToPageRef.current(next);
    }, AUTO_PLAY_INTERVAL);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (layoutWidth <= 0) return;
    startTimer();
    return stopTimer;
  }, [layoutWidth, startTimer, stopTimer]);

  const onPauseAutoPlay = useCallback(() => {
    isPausedRef.current = true;
    stopTimer();
  }, [stopTimer]);

  const onResumeAutoPlay = useCallback(() => {
    isPausedRef.current = false;
    if (layoutWidth > 0) startTimer();
  }, [startTimer, layoutWidth]);

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (layoutWidth <= 0) return;
      snapToFirstIfNeeded(e.nativeEvent.contentOffset.x);
      onResumeAutoPlay();
    },
    [layoutWidth, snapToFirstIfNeeded, onResumeAutoPlay],
  );

  if (layoutWidth <= 0) {
    return (
      <View
        style={[styles.container, styles.placeholder, {height: bannerHeight}]}
        onLayout={onLayout}>
        <Image
          source={BANNER_IMAGES[0]}
          style={styles.placeholderImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {height: bannerHeight}]}
      onLayout={onLayout}
      onTouchStart={onPauseAutoPlay}
      onTouchEnd={onResumeAutoPlay}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={onPauseAutoPlay}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}>
        {Array.from({length: TOTAL_SLIDES}, (_, i) => {
          const pageIndex = i % PAGE_COUNT;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.page, {width: layoutWidth, height: bannerHeight}]}
              activeOpacity={0.9}
              onPress={() => onPagePress?.(pageIndex)}>
              <Image
                source={BANNER_IMAGES[pageIndex]}
                style={styles.pageImage}
                resizeMode="cover"
              />
              <View style={styles.pageInner}>
                <Text style={styles.pageText}>酒店广告 · 点击进入详情</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.dots}>
        {Array.from({length: PAGE_COUNT}, (_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dot, currentIndex === i && styles.dotActive]}
            onPress={() => goToPage(i)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
  },
  pageImage: {
    ...StyleSheet.absoluteFillObject,
  },
  pageInner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 36,
  },
  pageText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  dots: {
    position: 'absolute',
    right: 12,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
