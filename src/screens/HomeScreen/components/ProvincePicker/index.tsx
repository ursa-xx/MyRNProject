/**
 * 省份选择弹窗：中国 34 个省级行政区列表，选中后回调
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {PROVINCES} from '../../constants';

export type ProvincePickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (province: string) => void;
};

export function ProvincePicker({
  visible,
  onClose,
  onSelect,
}: ProvincePickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>选择省份</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Text style={styles.closeText}>关闭</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled">
            {PROVINCES.map(province => (
              <TouchableOpacity
                key={province}
                style={styles.item}
                onPress={() => {
                  onSelect(province);
                  onClose();
                }}
                activeOpacity={0.6}>
                <Text style={styles.itemText}>{province}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeText: {
    fontSize: 14,
    color: '#0a7ea4',
  },
  list: {
    maxHeight: 400,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
});
