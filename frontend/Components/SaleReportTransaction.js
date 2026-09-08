import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TransactionCard = ({ name, saleNo, date, amount, balance, onPress }) => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.txnCard} onPress={onPress}>
            <View style={styles.txnTopRow}>
                <Text style={styles.txnName} numberOfLines={1}>
                    {name}
                </Text>
                <View style={styles.txnTopRight}>
                    <Text style={styles.txnSaleNo}>SALE {saleNo}</Text>
                    <Text style={styles.txnDate}>{date}</Text>
                </View>
            </View>

            <View style={styles.txnBottomRow}>
                <View>
                    <Text style={styles.txnFieldLabel}>Amount</Text>
                    <Text style={styles.txnFieldValue}>₹ {amount}</Text>
                </View>
                <View>
                    <Text style={styles.txnFieldLabel}>Balance</Text>
                    <Text style={styles.txnFieldValue}>₹ {balance}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default memo(TransactionCard);

const styles = StyleSheet.create({
    txnCard: {
        backgroundColor: '#F7F8F9',
        marginHorizontal: 16,
        marginTop: 14,
        borderRadius: 12,
        padding: 16,
    },
    txnTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    txnName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        flexShrink: 1,
        marginRight: 8,
    },
    txnTopRight: {
        alignItems: 'flex-end',
    },
    txnSaleNo: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    txnDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 3,
    },
    txnBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txnFieldLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    txnFieldValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
});