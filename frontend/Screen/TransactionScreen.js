import React, {
    useState,
    useEffect,
    useMemo,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from "react-native";

import {
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppButton from "../Components/AppButton";
import Header from "../Components/Header";
import CustomTabs from "../Components/CustomTab";
import QuickLinks from "../Components/QuickLinks";
import SearchBar from "../Components/SearchBar";
import TransactionCard from "../Components/TransactionCard";
import BottomNav from "../Components/BottomNav";


const TransactionScreen = () => {

    // ==========================================
    // NAVIGATION
    // ==========================================

    const navigation = useNavigation();
    const route = useRoute();

    // ==========================================
    // STATES
    // ==========================================

    const [activeTab, setActiveTab] = useState("transaction");
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ==========================================
    // GET ROUTE PARAMS
    // ==========================================

    const newSale = route?.params?.newSale;
    const updatedSale = route?.params?.updatedSale;
    const deletedSaleId = route?.params?.deletedSaleId;

    // ==========================================
    // DATE FORMATTER
    // ==========================================

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear().toString().slice(-2)}`;
    };

    // ==========================================
    // LOAD TRANSACTIONS FROM API
    // ==========================================

    const loadTransactions = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading transactions...');

            const token = await AsyncStorage.getItem('token');

            if (!token) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await fetch('http://10.151.11.36:5001/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                const mappedTransactions = data.transactions.map(item => ({
                    id: String(item.id),
                    name: item.customer_name || item.customerName || 'No Name',
                    customerName: item.customer_name || item.customerName || 'No Name',
                    amount: Number(item.total_amount || item.totalAmount || 0).toFixed(2),
                    balance: Number(item.due_amount || item.dueAmount || 0).toFixed(2),
                    transactionNumber: item.transaction_number || item.transactionNumber || `TXN-${item.id}`,
                    date: formatDate(item.date),
                    phoneNumber: item.phone_number || item.phoneNumber || '',
                    address: item.address || '',
                    description: item.description || '',
                    saleType: item.sale_type || item.saleType || 'Cash',
                    totalAmount: Number(item.total_amount || item.totalAmount || 0),
                    receivedAmount: Number(item.received_amount || item.receivedAmount || 0),
                    dueAmount: Number(item.due_amount || item.dueAmount || 0),
                    paymentMethod: item.payment_method || item.paymentMethod || 'Cash',
                    isReceived: item.is_received === 1 || item.isReceived === true,
                    items: item.items || []
                }));

                setTransactions(mappedTransactions);
                console.log('✅ Loaded', mappedTransactions.length, 'transactions');
            }
        } catch (error) {
            console.error('❌ Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ==========================================
    // PULL TO REFRESH
    // ==========================================

    const onRefresh = () => {
        setRefreshing(true);
        loadTransactions();
    };

    // ==========================================
    // ✅ SEARCH TRANSACTIONS - Name, Phone, Invoice
    // ==========================================

    const filteredTransactions = useMemo(() => {
        if (search.trim() === '') {
            return transactions;
        }

        const searchText = search.trim().toLowerCase();
        return transactions.filter((item) => {
            const name = String(item.name || item.customerName || "").toLowerCase();
            const phone = String(item.phoneNumber || "").toLowerCase();
            const txNumber = String(item.transactionNumber || "").toLowerCase();

            return name.includes(searchText) ||
                phone.includes(searchText) ||
                txNumber.includes(searchText);
        });
    }, [transactions, search]);

    // ==========================================
    // LOAD ON MOUNT - ✅ Fixed (only one useEffect)
    // ==========================================

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem('token');
            console.log('🔑 Token:', token ? '✅ Found' : '❌ Not found');

            if (!token) {
                Alert.alert('Session Expired', 'Please login again');
                navigation.replace('LoginScreen');
                return;
            }

            loadTransactions();
        };

        init();
    }, []);

    // ==========================================
    // ADD NEW SALE
    // ==========================================

    useEffect(() => {
        if (!newSale) return;

        const transaction = {
            ...newSale,
            id: newSale.id || Date.now().toString(),
            customerName: newSale.customerName || newSale.name || "",
            name: newSale.customerName || newSale.name || "Customer",
            amount: Number(newSale.totalAmount || newSale.amount || 0).toFixed(2),
            balance: Number(newSale.dueAmount ?? newSale.balance ?? 0).toFixed(2),
            totalAmount: Number(newSale.totalAmount || newSale.amount || 0),
            dueAmount: Number(newSale.dueAmount ?? newSale.balance ?? 0),
            transactionNumber: newSale.transactionNumber || newSale.invoiceNumber || `TXN-${Date.now().toString().slice(-4)}`,
            date: newSale.date || new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
            }),
            phoneNumber: newSale.phoneNumber || '',
        };

        setTransactions((prev) => {
            const exists = prev.some((item) => item.id === transaction.id);
            if (exists) return prev;
            return [transaction, ...prev];
        });

        navigation.setParams({ newSale: undefined });
    }, [newSale, navigation]);

    // ==========================================
    // UPDATE SALE
    // ==========================================

    useEffect(() => {
        const updatedSale = route?.params?.updatedSale;

        if (!updatedSale) {
            return;
        }

        console.log('🔄 Updating transaction in list:', updatedSale.id);
        console.log('📝 Updated data:', updatedSale);

        setTransactions((prev) =>
            prev.map((item) => {
                if (item.id === updatedSale.id) {
                    console.log('✅ Found and updating:', item.id);
                    return {
                        ...item,
                        ...updatedSale,
                        name: updatedSale.customerName || updatedSale.name,
                        customerName: updatedSale.customerName || updatedSale.name,
                        amount: Number(updatedSale.totalAmount || updatedSale.amount || 0).toFixed(2),
                        balance: Number(updatedSale.dueAmount || updatedSale.balance || 0).toFixed(2),
                        totalAmount: Number(updatedSale.totalAmount || updatedSale.totalAmount || 0),
                        dueAmount: Number(updatedSale.dueAmount || updatedSale.dueAmount || 0),
                        receivedAmount: Number(updatedSale.receivedAmount || updatedSale.receivedAmount || 0),
                        paymentMethod: updatedSale.paymentMethod || 'Cash',
                        phoneNumber: updatedSale.phoneNumber || '',
                        address: updatedSale.address || '',
                        description: updatedSale.description || '',
                        saleType: updatedSale.saleType || 'sale',
                        items: updatedSale.items || []
                    };
                }
                return item;
            })
        );

        // Clear param so it doesn't run again
        navigation.setParams({ updatedSale: undefined });

    }, [route?.params?.updatedSale, navigation]);


    // ==========================================
    // DELETE SALE
    // ==========================================

    useEffect(() => {
        if (!deletedSaleId) return;

        setTransactions((prev) =>
            prev.filter((item) => item.id !== deletedSaleId)
        );

        navigation.setParams({ deletedSaleId: undefined });
    }, [deletedSaleId, navigation]);

    // ==========================================
    // EDIT TRANSACTION
    // ==========================================

    const handleEditTransaction = (transactionId) => {
        console.log('✏️ Edit transaction:', transactionId);

        const transaction = transactions.find(item => item.id === transactionId);

        if (transaction) {
            navigation.navigate('SaleScreen', {
                saleData: transaction,
                isEditMode: true,
            });
        }
    };

    // ==========================================
    // DELETE TRANSACTION
    // ==========================================

    const handleDeleteTransaction = async (transactionId) => {
        console.log('🗑️ Delete transaction:', transactionId);

        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');

                            if (!token) {
                                Alert.alert('Error', 'Please login again');
                                navigation.replace('LoginScreen');
                                return;
                            }

                            const response = await fetch(`http://10.151.11.36:5001/api/transactions/${transactionId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });

                            const data = await response.json();

                            if (data.success) {
                                Alert.alert('✅ Success', 'Transaction deleted successfully');
                                setTransactions(prev => prev.filter(item => item.id !== transactionId));
                            } else {
                                Alert.alert('❌ Error', data.message || 'Failed to delete');
                            }
                        } catch (error) {
                            console.error('❌ Delete error:', error);
                            Alert.alert('❌ Error', 'Could not delete transaction');
                        }
                    },
                },
            ]
        );
    };

    // ==========================================
    // UPDATE TRANSACTION
    // ==========================================

    const handleUpdateTransaction = async (transactionId, updatedData) => {
        console.log('🔄 Updating transaction:', transactionId);

        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Error', 'Please login again');
                navigation.replace('LoginScreen');
                return;
            }

            const response = await fetch(`http://10.151.11.36:5001/api/transactions/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('✅ Success', 'Transaction updated successfully');
                await loadTransactions();
            } else {
                Alert.alert('❌ Error', data.message || 'Failed to update');
            }
        } catch (error) {
            console.error('❌ Update error:', error);
            Alert.alert('❌ Error', 'Could not update transaction');
        }
    };

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleTransactionPress = (transaction) => {
        navigation.navigate("SaleScreen", {
            saleData: transaction,
            isEditMode: true,
        });
    };

    const handleFilterPress = () => {
        Alert.alert("Filter", "Filter options yaha open honge.");
    };

    const handleAddSale = () => {
        navigation.navigate("SaleScreen", {
            isEditMode: false,
        });
    };

    // ==========================================
    // EMPTY LIST
    // ==========================================

    const renderEmptyList = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#075CA8" />
                    <Text style={styles.emptyText}>Loading transactions...</Text>
                </View>
            );
        }
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transaction found</Text>
            </View>
        );
    };

    // ==========================================
    // RENDER TRANSACTION
    // ==========================================

    const renderTransaction = ({ item }) => {
        return (
            <TransactionCard
                id={item.id}
                name={item.name || item.customerName || 'Unknown'}
                amount={item.amount || '0.00'}
                balance={item.balance || '0.00'}
                transactionNumber={item.transactionNumber || 'N/A'}
                date={item.date || 'N/A'}
                onPress={() => handleTransactionPress(item)}
                onPrint={() => navigation.navigate("PrintBillScreen", { saleData: item })}
                onEdit={() => handleEditTransaction(item.id)}
                onDelete={() => handleDeleteTransaction(item.id)}
            />
        );
    };

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderTransaction}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#075CA8']}
                        tintColor="#075CA8"
                    />
                }

                ListHeaderComponent={
                    <>
                        <Header />
                        <CustomTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                        <QuickLinks />
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            onFilterPress={handleFilterPress}
                            placeholder="Search by name, phone or invoice"
                        />
                    </>
                }

                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.listContent}
            />

            <AppButton
                title="Add New Sale"
                icon="shopping-cart"
                backgroundColor="red"
                onPress={handleAddSale}
                style={styles.addButton}
            />

            <BottomNav />
        </View>
    );
};

export default TransactionScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    listContent: {
        paddingBottom: 150,
        flexGrow: 1,
    },

    emptyContainer: {
        height: 180,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        fontSize: 15,
        color: "#999",
        fontWeight: "600",
        marginTop: 10,
    },

    addButton: {
        position: "absolute",
        right: 20,
        bottom: 85,
        width: 170,
        height: 55,
        borderRadius: 28,
        elevation: 6,
    },
});