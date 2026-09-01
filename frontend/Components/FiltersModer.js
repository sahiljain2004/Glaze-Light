import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const FILTER_SECTIONS = [
    { key: 'urpUser', label: 'URP User', options: ['All Users', 'Admin', 'Cashier 1', 'Cashier 2'] },
    { key: 'txnsType', label: 'Txns Type', options: ['Sale & Cr. Note', 'Sale Only', 'Cr. Note Only'] },
    { key: 'party', label: 'Party', options: ['All Parties', 'vgr', 'Ramkumar Tiwari Ji', 'Vaibhav awasthi'] },
];

export default function FiltersModal({ visible, initialFilters, onClose, onApply }) {
    const [selected, setSelected] = useState(initialFilters);

    // Keep local state in sync whenever the modal is (re)opened with fresh values
    useEffect(() => {
        if (visible) setSelected(initialFilters);
    }, [visible, initialFilters]);

    const handleSelect = (sectionKey, value) => {
        setSelected((prev) => ({ ...prev, [sectionKey]: value }));
    };

    const handleApply = () => {
        onApply(selected);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="x" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        {FILTER_SECTIONS.map((section) => (
                            <View key={section.key} style={styles.section}>
                                <Text style={styles.sectionLabel}>{section.label}</Text>
                                <View style={styles.optionsRow}>
                                    {section.options.map((opt) => {
                                        const isSelected = selected[section.key] === opt;
                                        return (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                                                onPress={() => handleSelect(section.key, opt)}
                                            >
                                                <Text style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                        <Text style={styles.applyBtnText}>Apply Filters</Text>
                    </TouchableOpacity>
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
        maxHeight: '80%',
        paddingBottom: 16,
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
    body: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 10,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionChip: {
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    optionChipSelected: {
        backgroundColor: '#2E7BF6',
    },
    optionChipText: {
        fontSize: 13,
        color: '#4B5563',
    },
    optionChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    applyBtn: {
        marginHorizontal: 20,
        marginTop: 8,
        backgroundColor: '#2E7BF6',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});