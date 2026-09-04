import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Text,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import SaleReportHeader from '../Components/SaleReportHeader';
import DateFilterBar from '../Components/DateFilter';
import FiltersAppliedBar from '../Components/FiltersAppliedbar';
import SummaryCards from '../Components/SaleReportSummary';
import TransactionCard from '../Components/SaleReportTransaction';
import PeriodDropdownModal from '../Components/SaleReportDropDown';
import CustomCalendarModal from '../Components/CustomCalendarModel';
import FiltersModal from '../Components/FiltersModer';
import {
    getPeriodRange,
    formatDate,
    isWithinRange,
    parseDateString
} from '../Components/DateHelpers';

function formatMoney(n) {
    const num = Number(n) || 0;
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDisplayDate(dateString) {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear().toString().slice(-2)}`;
}

export default function SaleReportScreen({ navigation }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');
    const [periodModalVisible, setPeriodModalVisible] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [customRange, setCustomRange] = useState(null);

    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({
        urpUser: 'All Users',
        txnsType: 'Sale & Cr. Note',
        party: 'All Parties',
    });

    const fetchSales = async () => {
        try {
            setLoading(true);

            const { data } = await api.get('/api/sale-report');

            if (data.success) {
                setSales(data.transactions || []);
            } else {
                setSales([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setSales([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSales();
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const activeRange = useMemo(() => {
        if (customRange) return customRange;
        return getPeriodRange(selectedPeriod);
    }, [customRange, selectedPeriod]);

    const filteredTransactions = useMemo(() => {
        const filtered = sales.filter((t) => {
            const dateObj = t.date ? new Date(t.date) : new Date();
            const isInRange = isWithinRange(dateObj, activeRange.from, activeRange.to);
            return isInRange;
        });
        return filtered;
    }, [sales, activeRange]);

    const summary = useMemo(() => {
        const noOfTxns = filteredTransactions.length;

        const totalSale = filteredTransactions.reduce((sum, t) => {
            return sum + Number(t.totalAmount || t.amount || 0);
        }, 0);

        const totalReceived = filteredTransactions.reduce((sum, t) => {
            return sum + Number(t.receivedAmount || 0);
        }, 0);

        const balanceDue = filteredTransactions.reduce((sum, t) => {
            return sum + Number(t.dueAmount || t.balance || 0);
        }, 0);

        return {
            noOfTxns,
            totalSale: formatMoney(totalSale),
            totalReceived: formatMoney(totalReceived),
            balanceDue: formatMoney(balanceDue),
        };
    }, [filteredTransactions]);

    const filterChips = [
        { label: 'URP User', value: appliedFilters.urpUser },
        { label: 'Txns Type', value: appliedFilters.txnsType },
        { label: 'Party', value: appliedFilters.party },
    ];

    const handleSelectPeriod = (period) => {
        setSelectedPeriod(period);
        setCustomRange(null);
        if (period === 'Custom Range') {
            setCalendarVisible(true);
        }
    };

    const handleApplyCustomRange = (from, to) => {
        setCustomRange({ from, to });
        setSelectedPeriod('Custom Range');
        setCalendarVisible(false);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sales found</Text>
            <Text style={styles.emptySubText}>Add a new sale to see it here</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#075CA8" />
                <Text style={styles.loadingText}>Loading sales...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <SaleReportHeader
                title="Sale Report"
                onBack={() => navigation?.goBack?.()}
                onShare={() => { }}
                onPdf={() => { }}
                onXls={() => { }}
            />

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => String(item.id || Date.now())}
                renderItem={({ item }) => (
                    <TransactionCard
                        name={item.customerName || item.name || 'Unknown'}
                        saleNo={item.transactionNumber || item.id || 'N/A'}
                        date={item.date ? formatDisplayDate(item.date) : 'N/A'}
                        amount={formatMoney(Number(item.totalAmount || item.amount || 0))}
                        balance={formatMoney(Number(item.dueAmount || item.balance || 0))}
                        onPress={() => {
                            navigation.navigate('SaleScreen', {
                                saleData: item,
                                isEditMode: true,
                            });
                        }}
                    />
                )}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#075CA8']}
                        tintColor="#075CA8"
                    />
                }
                ListHeaderComponent={
                    <View>
                        <DateFilterBar
                            period={selectedPeriod}
                            fromDate={formatDate(activeRange.from)}
                            toDate={formatDate(activeRange.to)}
                            onPressPeriod={() => setPeriodModalVisible(true)}
                            onPressCalendar={() => setCalendarVisible(true)}
                        />
                        <View style={styles.divider} />
                        <FiltersAppliedBar
                            filters={filterChips}
                            onPressFilters={() => setFiltersModalVisible(true)}
                        />
                        <SummaryCards
                            noOfTxns={summary.noOfTxns}
                            totalSale={summary.totalSale}
                            balanceDue={summary.balanceDue}
                            totalReceived={summary.totalReceived}
                        />
                    </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <PeriodDropdownModal
                visible={periodModalVisible}
                selectedPeriod={selectedPeriod}
                onClose={() => setPeriodModalVisible(false)}
                onSelect={handleSelectPeriod}
            />

            <FiltersModal
                visible={filtersModalVisible}
                initialFilters={appliedFilters}
                onClose={() => setFiltersModalVisible(false)}
                onApply={(filters) => setAppliedFilters(filters)}
            />

            <CustomCalendarModal
                visible={calendarVisible}
                initialFrom={activeRange.from}
                initialTo={activeRange.to}
                onClose={() => setCalendarVisible(false)}
                onApply={handleApplyCustomRange}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#EDEEF0',
    },
    listContent: {
        paddingBottom: 24,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
    },
    emptySubText: {
        fontSize: 14,
        color: '#BBB',
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});
