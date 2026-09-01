import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function DateFilterBar({ period = 'This Month', fromDate, toDate, onPressPeriod, onPressCalendar }) {
    return (
        <View style={styles.dateBar}>
            <TouchableOpacity style={styles.periodDropdown} onPress={onPressPeriod} activeOpacity={0.6}>
                <Text style={styles.periodText}>{period}</Text>
                <Icon name="chevron-down" size={18} color="#374151" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateRange} onPress={onPressCalendar} activeOpacity={0.6}>
                <Icon name="calendar" size={16} color="#2E7BF6" />
                <Text style={styles.dateText}>{fromDate}</Text>
                <Text style={styles.toText}>TO</Text>
                <Text style={styles.dateText}>{toDate}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    dateBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    periodDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    periodText: {
        fontSize: 15,
        color: '#374151',
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    toText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        marginHorizontal: 8,
    },
});