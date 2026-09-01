import React, {
    useState,
    useEffect,
} from "react";
import { searchItems, updateItemStock } from '../services/itemApi';

import { API_URL } from '../config';
import AppButton from "../Components/AppButton";
import { updateTransaction,createTransaction } from '../services/transactionApi'; // ✅ Add this import
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";

import {
    useNavigation,
    useRoute,
} from "@react-navigation/native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";

import SaleInput from "../Components/SaleInput";
import BilledItemsCard from "../Components/BilledItemCard";
import PaymentSummary from "../Components/PaymentSummary";
import PaymentMethod from "../Components/PaymentMethod";


const SaleScreen = () => {
    // ==========================================
    // NAVIGATION AND ROUTE
    // ==========================================

    const navigation = useNavigation();

    const route = useRoute();

    const [itemSuggestions, setItemSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [isEditing, setIsEditing] =
        useState(false);
    const saleData =
        route?.params?.saleData || null;

    const isEditMode =
    route?.params?.isEditMode === true;
    const isFormEditable =
        !isEditMode || isEditing;

    // ==========================================
    // STATES
    // ==========================================

    const [description, setDescription] =
        useState(
            saleData?.description || ""
        );


    const [receivedAmount, setReceivedAmount] =
        useState(
            saleData?.receivedAmount?.toString() || ""
        );


    const [paymentMethod, setPaymentMethod] =
        useState(
            saleData?.paymentMethod || "Cash"
        );


    const [isReceived, setIsReceived] =
        useState(
            saleData?.isReceived || false
        );


    const [customerName, setCustomerName] =
        useState(
            saleData?.customerName ||
            saleData?.name ||
            ""
        );


    const [phoneNumber, setPhoneNumber] =
        useState(
            saleData?.phoneNumber || ""
        );


    const [address, setAddress] =
        useState(
            saleData?.address || ""
        );


    const [saleType, setSaleType] =
        useState(
            saleData?.saleType || "Credit"
        );


    const [items, setItems] =
        useState(
            saleData?.items || []
        );


  

    useEffect(() => {

        const newItem =
            route?.params?.newItem;


        if (!newItem) {

            return;

        }


        setItems((previousItems) => {

            const itemAlreadyExists =
                previousItems.some(
                    (item) => item.id === newItem.id
                );


            if (itemAlreadyExists) {

                return previousItems;

            }


            return [
                ...previousItems,
                newItem,
            ];

        });


        // Clear newItem parameter
        navigation.setParams({
            newItem: undefined,
        });


    }, [
        route?.params?.newItem,
        navigation,
    ]);

    const handleItemSearch = async (text) => {
        // Update item name
        setItemName(text);

        if (text.trim().length < 2) {
            setItemSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const response = await searchItems(text);
            if (response.success) {
                setItemSuggestions(response.items || []);
                setShowSuggestions(response.items?.length > 0);
            }
        } catch (error) {
            console.error('❌ Search error:', error);
        }
    };

    const selectItem = (item) => {
        console.log('📦 Selected Item:', item);

        setItemName(item.name);
        setSelectedItem(item);
        setItemSuggestions([]);
        setShowSuggestions(false);

        // Auto-fill rate
        const rate = Number(item.price);
        const existingItem = items.find(i => i.id === item.id);

        if (!existingItem) {
            // Add item to list
            const newItem = {
                id: item.id,
                name: item.name,
                rate: rate,
                price: rate,
                quantity: 1,
                total: rate,
            };
            setItems(prev => [...prev, newItem]);
        } else {
            // Increase quantity if already added
            increaseQuantity(item.id);
        }

        // Clear item name for next entry
        setTimeout(() => {
            setItemName('');
            setSelectedItem(null);
        }, 300);
    };

    const totalAmount =
        items.reduce(
            (total, item) => {

                return (
                    total +
                    Number(item.total || 0)
                );

            },
            0
        );


    const received =
        Number(receivedAmount) || 0;


    const dueAmount =
        Math.max(
            totalAmount - received,
            0
        );


    // ==========================================
    // ADD ITEMS SCREEN
    // ==========================================

    
    const handleStartEditing = () => {

        setIsEditing(true);

    };
    <AppButton
        title="Edit"
        icon="edit"
        onPress={handleStartEditing}
    />
    const handleUpdateSale = () => {

        const updatedSale = {

            ...saleData,

            id: saleData.id,

            customerName: customerName,

            name: customerName,

            phoneNumber: phoneNumber,

            address: address,

            description: description,

            items: items,

            totalAmount: totalAmount,

            receivedAmount: receivedAmount,

            dueAmount: dueAmount,

            amount:
                Number(totalAmount).toFixed(2),

            balance:
                Number(dueAmount).toFixed(2),

            paymentMethod: paymentMethod,

            saleType: saleType,

        };


        navigation.navigate(
            "TransactionScreen",
            {
                updatedSale: updatedSale,
            }
        );

    };
    // ==========================================
    // SAVE SALE
    // ==========================================

    // ==========================================
    // SAVE SALE
    // ==========================================

    const handleSaveSale = async () => {
        console.log('🔴🔴🔴 SAVE BUTTON PRESSED 🔴🔴🔴');

        // Validation
        if (customerName.trim() === "") {
            Alert.alert("Required", "Please enter customer name");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Required", "Please add at least one item");
            return;
        }

        // Prepare data
        const newSaleData = {
            customerName: customerName.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
            description: description.trim(),
            saleType: saleType,
            totalAmount: totalAmount,
            receivedAmount: Number(receivedAmount) || 0,
            dueAmount: dueAmount,
            paymentMethod: paymentMethod,
            items: items,
            date: new Date().toISOString().split('T')[0]
        };

        console.log("📝 Sending data:", JSON.stringify(newSaleData, null, 2));

        try {
            // ✅ Check if createTransaction exists
            if (typeof createTransaction !== 'function') {
                console.error('❌ createTransaction is not a function!');
                Alert.alert('Error', 'API function not found. Please restart app.');
                return;
            }

            const response = await createTransaction(newSaleData);
            console.log("📥 Response:", response);

            if (response.success) {

                // Reduce stock for each billed item
                for (const billItem of items) {
                    const dbId = billItem.dbId ?? billItem.itemId;
                    const qty = Number(billItem.quantity || 1);

                    if (qty > 0) {
                        try {
                            await updateItemStock(dbId, qty, billItem.name || '');
                            console.log('📦 Stock reduced for item', billItem.name || dbId, 'by', qty);
                        } catch (stockError) {
                            console.error('❌ Stock update error:', stockError);
                        }
                    }
                }

                Alert.alert(
                    "✅ Success",
                    "Sale saved successfully!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.navigate("TransactionScreen", {
                                    newSale: {
                                        ...newSaleData,
                                        id: response.transactionId || Date.now().toString(),
                                        transactionNumber: `TXN-${Date.now().toString().slice(-6)}`,
                                        amount: totalAmount.toFixed(2),
                                        balance: dueAmount.toFixed(2),
                                    }
                                });
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("❌ Error", response.message || "Failed to save sale");
            }
        } catch (error) {
            console.error("❌ Save Error:", error);
            Alert.alert("❌ Error", error.message || "Could not save sale");
        }
    };


    // ==========================================
    // EDIT SALE
    // ==========================================

    const handleEditSale = async () => {
        console.log('✏️ EDIT SALE STARTED');

        if (customerName.trim() === "") {
            Alert.alert("Required", "Please enter customer name");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Required", "Please add at least one item");
            return;
        }

        const updatedData = {
            customerName: customerName.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
            description: description.trim(),
            saleType: saleType,
            totalAmount: totalAmount,
            receivedAmount: Number(receivedAmount) || 0,
            dueAmount: dueAmount,
            paymentMethod: paymentMethod,
            items: items,
            date: new Date().toISOString().split('T')[0]
        };

        console.log('📝 Updated Data:', updatedData);

        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Error', 'Please login again');
                navigation.replace('LoginScreen');
                return;
            }

            // ✅ PUT request
            const response = await fetch(`http://10.151.11.36:5001/api/transactions/${saleData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            console.log('📡 Status:', response.status);

            const data = await response.json();
            console.log('📥 Response:', data);

            if (data.success) {
                Alert.alert(
                    "✅ Success",
                    "Sale updated successfully!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // ✅ Send updated sale back
                                navigation.navigate("TransactionScreen", {
                                    updatedSale: {
                                        ...saleData,
                                        ...updatedData,
                                        customerName: updatedData.customerName,
                                        name: updatedData.customerName,
                                    }
                                });
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("❌ Error", data.message || "Failed to update");
            }
        } catch (error) {
            console.error('❌ Update Error:', error);
            Alert.alert("❌ Error", "Could not update sale. Please try again.");
        }
    };
   
    // ==========================================
    // DELETE SALE
    // ==========================================

    const handleDeleteSale = () => {
        Alert.alert(
            "Delete Sale",
            `Are you sure you want to delete this sale?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        console.log('🗑️ Delete sale:', saleData?.id);

                        try {
                            const token = await AsyncStorage.getItem('token');

                            if (!token) {
                                Alert.alert('Error', 'Please login again');
                                navigation.replace('LoginScreen');
                                return;
                            }

                            const response = await fetch(`http://10.151.11.36:5001/api/transactions/${saleData.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });

                            const data = await response.json();

                            if (data.success) {
                                Alert.alert(
                                    '✅ Success',
                                    'Transaction deleted successfully',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                navigation.navigate('TransactionScreen', {
                                                    deletedSaleId: saleData.id,
                                                });
                                            }
                                        }
                                    ]
                                );
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
    // PAYMENT RECEIVED
    // ==========================================

    const handlePaymentReceived = () => {

        const newStatus =
            !isReceived;


        setIsReceived(
            newStatus
        );


        if (newStatus) {

            setReceivedAmount(
                totalAmount.toFixed(2)
            );

        } else {

            setReceivedAmount("");

        }

    };


    // ==========================================
    // SAVE AND NEW
    // ==========================================

    const handleSaveAndNew = async () => {
        if (customerName.trim() === "") {
            Alert.alert("Required", "Please enter customer name");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Required", "Please add at least one item");
            return;
        }

        // First save
        await handleSaveSale();

        // Reset form for new entry
        setCustomerName("");
        setPhoneNumber("");
        setAddress("");
        setDescription("");
        setItems([]);
        setReceivedAmount("");
    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <View style={styles.container}>


            {/* ================= HEADER ================= */}

            <View style={styles.header}>


                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        navigation.goBack()
                    }
                >

                    <Feather
                        name="arrow-left"
                        size={27}
                        color="#222"
                    />

                </TouchableOpacity>


                <Text style={styles.headerTitle}>
                    {isEditMode
                        ? "Sale Details"
                        : "Sale"}
                </Text>


                <View
                    style={styles.saleTypeContainer}
                >

                    <TouchableOpacity
                        style={[
                            styles.typeButton,

                            saleType === "Credit" &&
                            styles.activeType,
                        ]}
                        onPress={() =>
                            setSaleType("Credit")
                        }
                    >

                        <Text
                            style={[
                                styles.typeText,

                                saleType === "Credit" &&
                                styles.activeTypeText,
                            ]}
                        >
                            Credit
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[
                            styles.typeButton,

                            saleType === "Cash" &&
                            styles.activeType,
                        ]}
                        onPress={() =>
                            setSaleType("Cash")
                        }
                    >

                        <Text
                            style={[
                                styles.typeText,

                                saleType === "Cash" &&
                                styles.activeTypeText,
                            ]}
                        >
                            Cash
                        </Text>

                    </TouchableOpacity>

                </View>


            </View>


            {/* ================= FORM ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
                keyboardShouldPersistTaps="handled"
            >


                {/* ================= INVOICE ================= */}

                <View style={styles.invoiceRow}>


                    <View>

                        <Text style={styles.smallLabel}>
                            Invoice No.
                        </Text>

                        <Text style={styles.invoiceText}>
                            {saleData?.invoiceNumber || "7155"}
                        </Text>

                    </View>


                    <View>

                        <Text style={styles.smallLabel}>
                            Date
                        </Text>

                        <Text style={styles.invoiceText}>
                            {saleData?.date ||
                                new Date().toLocaleDateString(
                                    "en-IN"
                                )}
                        </Text>

                    </View>


                </View>


                {/* ================= CUSTOMER ================= */}

                <SaleInput
                    label="Customer *"
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Enter customer name"
                    editable={isFormEditable}
                />


                <SaleInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                    editable={isFormEditable}
                />


                <SaleInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter customer address"
                    multiline={true}
                    editable={isFormEditable}
                />


                <SaleInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter sale description"
                    multiline={true}
                    editable={isFormEditable}
                />


                {/* ================= BILLED ITEMS ================= */}

                <BilledItemsCard
                    items={items}
                    setItems={setItems}
                    onAddItem={
                        isEditing || !isEditMode
                    }
                    editable={isFormEditable}
                />


                {/* ================= TOTAL ================= */}

                <View
                    style={
                        styles.totalAmountContainer
                    }
                >

                    <Text
                        style={
                            styles.totalAmountLabel
                        }
                    >
                        Total Amount
                    </Text>


                    <Text
                        style={
                            styles.totalAmount
                        }
                    >
                        ₹ {totalAmount.toFixed(2)}
                    </Text>

                </View>


                {/* ================= PAYMENT ================= */}

                <PaymentSummary
                    totalAmount={totalAmount}
                    receivedAmount={receivedAmount}
                    setReceivedAmount={setReceivedAmount}
                />


                <PaymentMethod
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    isReceived={isReceived}
                    onPaymentReceived={
                        handlePaymentReceived
                    }
                />


            </ScrollView>


            {/* ================= BOTTOM BUTTONS ================= */}

            <View style={styles.bottomContainer}>

                {isEditMode ? (

                    isEditing ? (

                        <>
                            {/* CANCEL */}

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>


                            {/* SAVE CHANGES */}

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleEditSale}
                            >
                                <Text style={styles.saveText}>
                                    Save Changes
                                </Text>
                            </TouchableOpacity>
                        </>

                    ) : (

                        <>
                            {/* EDIT */}

                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() =>
                                    setIsEditing(true)
                                }
                            >
                                <Feather
                                    name="edit-2"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.editText}>
                                    Edit
                                </Text>
                            </TouchableOpacity>


                            {/* DELETE */}

                            <TouchableOpacity
                                style={styles.deleteSaleButton}
                                onPress={handleDeleteSale}
                            >
                                <Feather
                                    name="trash-2"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.deleteSaleText}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </>

                    )

                ) : (

                    <>
                        {/* SAVE & NEW */}

                        <TouchableOpacity
                            style={styles.saveNewButton}
                            onPress={handleSaveAndNew}
                        >
                            <Text style={styles.saveNewText}>
                                Save & New
                            </Text>
                        </TouchableOpacity>


                        {/* SAVE */}

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveSale}
                        >
                            <Text style={styles.saveText}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </>

                )}

            </View>
        </View>

    );

};


export default SaleScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },


    header: {
        height: 75,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },


    backButton: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },


    headerTitle: {
        fontSize: 25,
        fontWeight: "700",
        color: "#222",
        marginLeft: 10,
    },


    saleTypeContainer: {
        flexDirection: "row",
        marginLeft: "auto",
        backgroundColor: "#F1F3F5",
        borderRadius: 25,
        padding: 3,
    },


    typeButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 22,
    },


    activeType: {
        backgroundColor: "#087A45",
    },


    typeText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#666",
    },


    activeTypeText: {
        color: "#FFFFFF",
    },


    scrollContent: {
        padding: 18,
        paddingBottom: 120,
    },


    invoiceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
        paddingHorizontal: 4,
    },


    smallLabel: {
        fontSize: 15,
        color: "#666",
        marginBottom: 7,
    },


    invoiceText: {
        fontSize: 19,
        fontWeight: "600",
        color: "#333",
    },


    totalAmountContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 22,
        paddingVertical: 15,
    },


    totalAmountLabel: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },


    totalAmount: {
        fontSize: 22,
        fontWeight: "800",
        color: "#222",
    },


    bottomContainer: {
        height: 75,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },


    saveNewButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },


    saveNewText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#444",
    },


    saveButton: {
        flex: 1.4,
        height: 52,
        backgroundColor: "#075CA8",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },


    saveText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    moreButton: {
        width: 45,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },


    editButton: {
        flex: 1,
        height: 52,
        backgroundColor: "#075CA8",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        marginRight: 8,
    },


    editText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    deleteSaleButton: {
        flex: 1,
        height: 52,
        backgroundColor: "#E53935",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        marginLeft: 8,
    },


    deleteSaleText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

});