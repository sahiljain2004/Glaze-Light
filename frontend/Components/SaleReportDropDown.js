import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PERIOD_OPTIONS = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Quarter',
    'This Year',
    'Last Year',
    'Custom Range',
];

export default function PeriodDropdownModal({ visible, selectedPeriod, onClose, onSelect }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Select Period</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="x" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={PERIOD_OPTIONS}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isSelected = item === selectedPeriod;
                            return (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                >
                                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                        {item}
                                    </Text>
                                    {isSelected && <Icon name="check" size={18} color="#2E7BF6" />}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 24,
        maxHeight: '70%',
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F1F3',
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    optionText: {
        fontSize: 15,
        color: '#374151',
    },
    optionTextSelected: {
        color: '#2E7BF6',
        fontWeight: '600',
    },
});