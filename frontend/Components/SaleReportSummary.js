import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCards({ noOfTxns, totalSale, balanceDue }) {
    return (
        <View style={styles.summaryWrapper}>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>No of Txns</Text>
                <Text style={styles.summaryValue}>{noOfTxns}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Sale</Text>
                <Text style={styles.summaryValue}>₹ {totalSale}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Balance Due</Text>
                <Text style={[styles.summaryValue, styles.balanceDueValue]}>₹ {balanceDue}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    summaryWrapper: {
        flexDirection: 'row',
        backgroundColor: '#CFE9F7',
        paddingVertical: 18,
        paddingHorizontal: 14,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'flex-start',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#B4DCF0',
    },
    summaryLabel: {
        fontSize: 12.5,
        color: '#5B6B7A',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    balanceDueValue: {
        color: '#1E8E4E',
    },
});