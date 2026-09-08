import React, { memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';

const RecentTransaction = ({ transactions = [] }) => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => {
        const isReceived = item.isReceived === true || item.isReceived === 1;

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    navigation.navigate('SaleScreen', {
                        saleData: item,
                        isEditMode: true,
                    });
                }}
            >
                <View style={styles.itemLeft}>
                    <View style={[styles.statusDot, isReceived ? styles.paidDot : styles.pendingDot]} />
                    <View>
                        <Text style={styles.customerName}>{item.customerName || 'Unknown'}</Text>
                        <Text style={styles.txNumber}>#{item.transactionNumber}</Text>
                    </View>
                </View>
                <View style={styles.itemRight}>
                    <Text style={styles.amount}>₹{item.amount || '0.00'}</Text>
                    <View style={[styles.badge, isReceived ? styles.paidBadge : styles.pendingBadge]}>
                        <Text style={[styles.badgeText, isReceived ? styles.paidBadgeText : styles.pendingBadgeText]}>
                            {isReceived ? 'Paid' : 'Due'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Transactions</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('TransactionScreen')}
                >
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No recent transactions</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#075CA8',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    paidDot: {
        backgroundColor: '#2E7D32',
    },
    pendingDot: {
        backgroundColor: '#E65100',
    },
    customerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    txNumber: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 4,
    },
    paidBadge: {
        backgroundColor: '#E8F5E9',
    },
    pendingBadge: {
        backgroundColor: '#FFF3E0',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    paidBadgeText: {
        color: '#2E7D32',
    },
    pendingBadgeText: {
        color: '#E65100',
    },
    emptyContainer: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
    },
});

export default memo(RecentTransaction);