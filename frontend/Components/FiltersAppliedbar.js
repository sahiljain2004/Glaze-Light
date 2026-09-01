import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function FiltersAppliedBar({ filters = [], onPressFilters }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.filtersHeaderRow}>
                <Text style={styles.filtersHeaderLabel}>Filters Applied:</Text>
                <TouchableOpacity style={styles.filtersBtn} onPress={onPressFilters} activeOpacity={0.6}>
                    <Icon name="filter" size={14} color="#2E7BF6" />
                    <Text style={styles.filtersBtnText}>Filters</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chipsRow}>
                {filters.map((f, idx) => (
                    <View key={idx} style={styles.chip}>
                        <Text style={styles.chipText}>
                            {f.label} - {f.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        paddingBottom: 14,
    },
    filtersHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    filtersHeaderLabel: {
        fontSize: 15,
        color: '#374151',
    },
    filtersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filtersBtnText: {
        color: '#2E7BF6',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    chip: {
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 12.5,
        color: '#4B5563',
    },
});