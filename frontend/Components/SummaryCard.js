import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';

const SummaryCard = ({ summary }) => {
    // Default values if summary is null
    const data = summary || {
        totalTransactions: 0,
        totalSales: '0.00',
        totalReceived: '0.00',
        totalDue: '0.00',
        pendingPayments: 0,
        completedPayments: 0,
        todayTransactions: 0,
        todaySales: '0.00'
    };

    return (
        <View style={styles.container}>
            {/* Row 1: Total Sales & Total Transactions */}
            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total Sales</Text>
                    <Text style={styles.cardValue}>₹{data.totalSales}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Transactions</Text>
                    <Text style={styles.cardValue}>{data.totalTransactions}</Text>
                </View>
            </View>

            {/* Row 2: Received & Due */}
            <View style={styles.row}>
                <View style={[styles.card, styles.receivedCard]}>
                    <Text style={styles.cardLabel}>Received</Text>
                    <Text style={[styles.cardValue, styles.receivedText]}>
                        ₹{data.totalReceived}
                    </Text>
                </View>
                <View style={[styles.card, styles.dueCard]}>
                    <Text style={styles.cardLabel}>Due</Text>
                    <Text style={[styles.cardValue, styles.dueText]}>
                        ₹{data.totalDue}
                    </Text>
                </View>
            </View>

            {/* Row 3: Today's Sales */}
            <View style={styles.row}>
                <View style={[styles.card, styles.todayCard]}>
                    <Feather name="calendar" size={20} color="#075CA8" />
                    <Text style={styles.cardLabel}>Today's Sales</Text>
                    <Text style={styles.cardValue}>₹{data.todaySales}</Text>
                    <Text style={styles.cardSubText}>
                        {data.todayTransactions} transactions today
                    </Text>
                </View>
            </View>

            {/* Row 4: Payment Status */}
            <View style={styles.row}>
                <View style={[styles.card, styles.pendingCard]}>
                    <Text style={styles.cardLabel}>Pending Payments</Text>
                    <Text style={[styles.cardValue, styles.pendingText]}>
                        {data.pendingPayments}
                    </Text>
                </View>
                <View style={[styles.card, styles.completedCard]}>
                    <Text style={styles.cardLabel}>Completed</Text>
                    <Text style={[styles.cardValue, styles.completedText]}>
                        {data.completedPayments}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },
    cardSubText: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    receivedCard: {
        backgroundColor: '#E8F5E9',
    },
    receivedText: {
        color: '#2E7D32',
    },
    dueCard: {
        backgroundColor: '#FFF3E0',
    },
    dueText: {
        color: '#E65100',
    },
    todayCard: {
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
    },
    pendingCard: {
        backgroundColor: '#FFF8E1',
    },
    pendingText: {
        color: '#F57F17',
    },
    completedCard: {
        backgroundColor: '#E8F5E9',
    },
    completedText: {
        color: '#2E7D32',
    },
});

export default SummaryCard;