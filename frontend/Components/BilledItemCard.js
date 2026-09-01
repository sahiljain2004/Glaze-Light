import React, { useState, useRef } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
    ScrollView,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";

import { searchItems } from "../services/itemApi";


const BilledItemsCard = ({
    items = [],
    onAddItem,
    setItems,
    editable = true,
}) => {

    // ==========================================
    // MODAL STATES
    // ==========================================

    const [modalVisible, setModalVisible] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemRate, setItemRate] = useState("");
    const [itemQuantity, setItemQuantity] = useState("1");
    const [itemSuggestions, setItemSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedDbId, setSelectedDbId] = useState(null);
    const blurTimeout = useRef(null);

    // ==========================================
    // ADD ITEM FROM MODAL
    // ==========================================

    const handleAddItem = () => {
        // Validation
        if (!itemName.trim()) {
            Alert.alert("Error", "Please enter item name");
            return;
        }

        if (!itemRate || Number(itemRate) <= 0) {
            Alert.alert("Error", "Please enter valid rate");
            return;
        }

        const quantity = Number(itemQuantity) || 1;
        const rate = Number(itemRate);
        const total = rate * quantity;

        const newItem = {
            id: Date.now().toString(),
            dbId: selectedDbId,
            name: itemName.trim(),
            rate: rate,
            price: rate,
            quantity: quantity,
            total: total,
        };

        // Add item to list
        setItems((prevItems) => [...prevItems, newItem]);

        // Reset form
        setItemName("");
        setItemRate("");
        setItemQuantity("1");
        setSelectedDbId(null);
        setModalVisible(false);

        Alert.alert("✅ Success", "Item added successfully!");
    };

    // ==========================================
    // SEARCH ITEMS (Autocomplete)
    // ==========================================

    const handleItemNameChange = async (text) => {
        setItemName(text);

        if (text.trim().length < 2) {
            setItemSuggestions([]);
            setShowSuggestions(false);
            setSelectedDbId(null);
            return;
        }

        try {
            const response = await searchItems(text);
            if (response.success) {
                setItemSuggestions(response.items || []);
                setShowSuggestions(response.items?.length > 0);
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const selectSuggestion = (item) => {
        setItemName(item.name);
        setItemRate(String(item.price || ""));
        setSelectedDbId(item.id);
        setItemSuggestions([]);
        setShowSuggestions(false);
    };

    const handleNameBlur = () => {
        blurTimeout.current = setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    const handleNameFocus = () => {
        if (blurTimeout.current) {
            clearTimeout(blurTimeout.current);
        }
        if (itemSuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    const increaseQuantity = (id) => {

        if (!setItems || !editable) return;

        setItems((previousItems) =>
            previousItems.map((item) => {

                if (item.id === id) {

                    const newQuantity =
                        Number(item.quantity || 1) + 1;

                    const rate =
                        Number(item.rate || item.price || 0);

                    return {
                        ...item,

                        quantity:
                            newQuantity,

                        total:
                            rate * newQuantity,
                    };
                }

                return item;

            })
        );

    };


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    const decreaseQuantity = (id) => {

        if (!setItems || !editable) return;

        setItems((previousItems) =>
            previousItems.map((item) => {

                if (item.id === id) {

                    const currentQuantity =
                        Number(item.quantity || 1);

                    const newQuantity =
                        Math.max(
                            currentQuantity - 1,
                            1
                        );

                    const rate =
                        Number(item.rate || item.price || 0);

                    return {
                        ...item,

                        quantity:
                            newQuantity,

                        total:
                            rate * newQuantity,
                    };
                }

                return item;

            })
        );

    };


    // ==========================================
    // HANDLE QUANTITY CHANGE (Input)
    // ==========================================

    const handleQuantityChange = (id, value) => {
        if (!setItems || !editable) return;

        const newQuantity = Number(value) || 1;
        if (newQuantity < 1) return;

        setItems((previousItems) =>
            previousItems.map((item) => {

                if (item.id === id) {

                    const rate =
                        Number(item.rate || item.price || 0);

                    return {
                        ...item,

                        quantity:
                            newQuantity,

                        total:
                            rate * newQuantity,
                    };
                }

                return item;

            })
        );
    };


    // ==========================================
    // DELETE ITEM
    // ==========================================

    const deleteItem = (id) => {

        if (!setItems || !editable) return;

        Alert.alert(
            "Delete Item",
            "Are you sure you want to remove this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setItems((previousItems) =>
                            previousItems.filter(
                                (item) => item.id !== id
                            )
                        );
                    },
                },
            ]
        );

    };


    // ==========================================
    // EDIT ITEM RATE
    // ==========================================

    const editItemRate = (id, newRate) => {

        if (!setItems || !editable) return;

        setItems((previousItems) =>
            previousItems.map((item) => {

                if (item.id === id) {

                    const rate = Number(newRate) || 0;
                    const quantity = Number(item.quantity || 1);

                    return {
                        ...item,
                        rate: rate,
                        price: rate,
                        total: rate * quantity,
                    };
                }

                return item;

            })
        );

    };


    return (

        <View style={styles.container}>

            {/* ================= HEADER ================= */}

            <View style={styles.header}>

                <View>

                    <Text style={styles.title}>
                        Billed Items
                    </Text>

                    <Text style={styles.subTitle}>
                        {items.length} item
                        {items.length !== 1 ? "s" : ""} added
                    </Text>

                </View>


                {editable && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.8}
                    >

                        <Feather
                            name="plus"
                            size={19}
                            color="#FFFFFF"
                        />

                        <Text style={styles.addButtonText}>
                            Add Item
                        </Text>

                    </TouchableOpacity>
                )}

            </View>


            {/* ================= EMPTY STATE ================= */}

            {items.length === 0 && (

                <View style={styles.emptyContainer}>

                    <View style={styles.emptyIconBox}>

                        <Feather
                            name="shopping-bag"
                            size={30}
                            color="#075CA8"
                        />

                    </View>


                    <Text style={styles.emptyTitle}>
                        No items added
                    </Text>


                    <Text style={styles.emptyText}>
                        Add products to create your bill
                    </Text>


                    {editable && (
                        <TouchableOpacity
                            style={styles.emptyAddButton}
                            onPress={() => setModalVisible(true)}
                            activeOpacity={0.8}
                        >

                            <Feather
                                name="plus-circle"
                                size={18}
                                color="#075CA8"
                            />

                            <Text style={styles.emptyAddText}>
                                Add Your First Item
                            </Text>

                        </TouchableOpacity>
                    )}

                </View>

            )}


            {/* ================= ITEMS LIST ================= */}

            {items.map((item, index) => {

                const quantity =
                    Number(item.quantity || 1);

                const rate =
                    Number(
                        item.rate ||
                        item.price ||
                        0
                    );

                const itemTotal =
                    Number(
                        item.total ||
                        rate * quantity
                    );


                return (

                    <View
                        key={
                            item.id ||
                            index.toString()
                        }
                        style={styles.itemCard}
                    >


                        {/* ===== TOP ROW ===== */}

                        <View style={styles.itemTopRow}>


                            <View
                                style={
                                    styles.itemNumberBox
                                }
                            >

                                <Text
                                    style={
                                        styles.itemNumber
                                    }
                                >
                                    {index + 1}
                                </Text>

                            </View>


                            <View
                                style={
                                    styles.itemInfo
                                }
                            >

                                <Text
                                    style={
                                        styles.itemName
                                    }
                                    numberOfLines={1}
                                >
                                    {
                                        item.name ||
                                        item.itemName ||
                                        item.productName ||
                                        "Item"
                                    }
                                </Text>


                                <Text
                                    style={
                                        styles.itemRate
                                    }
                                >
                                    ₹ {rate.toFixed(2)}
                                    {"  / item"}
                                </Text>

                            </View>


                            {editable && (
                                <TouchableOpacity
                                    style={
                                        styles.deleteButton
                                    }
                                    onPress={() =>
                                        deleteItem(item.id)
                                    }
                                >

                                    <Feather
                                        name="trash-2"
                                        size={19}
                                        color="#E53935"
                                    />

                                </TouchableOpacity>
                            )}

                        </View>


                        {/* ===== DIVIDER ===== */}

                        <View style={styles.divider} />


                        {/* ===== BOTTOM ROW ===== */}

                        <View style={styles.itemBottomRow}>


                            {/* QUANTITY - With Input and Plus/Minus */}

                            <View
                                style={
                                    styles.quantityContainer
                                }
                            >

                                <Text
                                    style={
                                        styles.quantityLabel
                                    }
                                >
                                    Qty
                                </Text>


                                <View
                                    style={
                                        styles.quantityControls
                                    }
                                >

                                    <TouchableOpacity
                                        style={
                                            styles.quantityButton
                                        }
                                        onPress={() =>
                                            decreaseQuantity(
                                                item.id
                                            )
                                        }
                                        disabled={!editable}
                                    >

                                        <Feather
                                            name="minus"
                                            size={17}
                                            color={
                                                editable ? "#075CA8" : "#CBD5E1"
                                            }
                                        />

                                    </TouchableOpacity>


                                    {/* ===== QUANTITY INPUT ===== */}

                                    <TextInput
                                        style={styles.quantityInput}
                                        value={String(quantity)}
                                        onChangeText={(text) =>
                                            handleQuantityChange(item.id, text)
                                        }
                                        keyboardType="numeric"
                                        editable={editable}
                                        selectTextOnFocus={true}
                                    />


                                    <TouchableOpacity
                                        style={
                                            styles.quantityButton
                                        }
                                        onPress={() =>
                                            increaseQuantity(
                                                item.id
                                            )
                                        }
                                        disabled={!editable}
                                    >

                                        <Feather
                                            name="plus"
                                            size={17}
                                            color={
                                                editable ? "#075CA8" : "#CBD5E1"
                                            }
                                        />

                                    </TouchableOpacity>

                                </View>

                            </View>


                            {/* TOTAL */}

                            <View
                                style={
                                    styles.totalContainer
                                }
                            >

                                <Text
                                    style={
                                        styles.totalLabel
                                    }
                                >
                                    Item Total
                                </Text>


                                <Text
                                    style={
                                        styles.itemTotal
                                    }
                                >
                                    ₹ {itemTotal.toFixed(2)}
                                </Text>

                            </View>


                        </View>


                    </View>

                );

            })}


            {/* ================= ADD ITEM MODAL ================= */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        {/* Modal Header */}

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Add Item
                            </Text>

                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >

                                <Feather
                                    name="x"
                                    size={24}
                                    color="#333"
                                />

                            </TouchableOpacity>

                        </View>

                        {/* Item Name */}

                        <Text style={styles.modalLabel}>
                            Item Name *
                        </Text>

                        <View style={styles.autocompleteWrapper}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Type to search item..."
                                value={itemName}
                                onChangeText={handleItemNameChange}
                                onBlur={handleNameBlur}
                                onFocus={handleNameFocus}
                            />

                            {showSuggestions && itemSuggestions.length > 0 && (
                                <View style={styles.suggestionDropdown}>
                                    {itemSuggestions.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.suggestionItem}
                                            onPress={() => selectSuggestion(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.suggestionName} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.suggestionPrice}>
                                                ₹{item.price}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Item Rate */}

                        <Text style={styles.modalLabel}>
                            Rate (₹) *
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter rate"
                            value={itemRate}
                            onChangeText={setItemRate}
                            keyboardType="numeric"
                        />

                        {/* Item Quantity */}

                        <Text style={styles.modalLabel}>
                            Quantity
                        </Text>

                        <View style={styles.modalQuantityContainer}>

                            <TouchableOpacity
                                style={styles.modalQuantityButton}
                                onPress={() => {
                                    const qty = Number(itemQuantity) || 1;
                                    if (qty > 1) {
                                        setItemQuantity(String(qty - 1));
                                    }
                                }}
                            >

                                <Feather
                                    name="minus"
                                    size={20}
                                    color="#075CA8"
                                />

                            </TouchableOpacity>

                            <TextInput
                                style={styles.modalQuantityInput}
                                value={itemQuantity}
                                onChangeText={setItemQuantity}
                                keyboardType="numeric"
                                textAlign="center"
                            />

                            <TouchableOpacity
                                style={styles.modalQuantityButton}
                                onPress={() => {
                                    const qty = Number(itemQuantity) || 1;
                                    setItemQuantity(String(qty + 1));
                                }}
                            >

                                <Feather
                                    name="plus"
                                    size={20}
                                    color="#075CA8"
                                />

                            </TouchableOpacity>

                        </View>

                        {/* Add Button */}

                        <TouchableOpacity
                            style={styles.modalAddButton}
                            onPress={handleAddItem}
                        >

                            <Feather
                                name="check"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.modalAddText}>
                                Add Item
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

        </View>

    );

};


export default BilledItemsCard;


const styles = StyleSheet.create({

    container: {

        backgroundColor: "#FFFFFF",

        borderRadius: 16,

        padding: 16,

        marginTop: 8,

        borderWidth: 1,

        borderColor: "#E8EDF3",

    },


    // ==========================================
    // HEADER
    // ==========================================

    header: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 16,

    },


    title: {

        fontSize: 19,

        fontWeight: "800",

        color: "#1E293B",

    },


    subTitle: {

        fontSize: 13,

        color: "#64748B",

        marginTop: 3,

    },


    addButton: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#075CA8",

        paddingHorizontal: 14,

        paddingVertical: 10,

        borderRadius: 9,

        gap: 5,

    },


    addButtonText: {

        color: "#FFFFFF",

        fontSize: 14,

        fontWeight: "700",

    },


    // ==========================================
    // EMPTY STATE
    // ==========================================

    emptyContainer: {

        alignItems: "center",

        paddingVertical: 28,

        borderRadius: 12,

        backgroundColor: "#F8FAFC",

        borderWidth: 1,

        borderColor: "#E8EDF3",

        borderStyle: "dashed",

    },


    emptyIconBox: {

        width: 60,

        height: 60,

        borderRadius: 30,

        backgroundColor: "#EAF4FF",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 12,

    },


    emptyTitle: {

        fontSize: 17,

        fontWeight: "700",

        color: "#334155",

    },


    emptyText: {

        fontSize: 13,

        color: "#94A3B8",

        marginTop: 5,

    },


    emptyAddButton: {

        flexDirection: "row",

        alignItems: "center",

        marginTop: 18,

        gap: 6,

    },


    emptyAddText: {

        fontSize: 14,

        fontWeight: "700",

        color: "#075CA8",

    },


    // ==========================================
    // ITEM CARD
    // ==========================================

    itemCard: {

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E2E8F0",

        borderRadius: 13,

        padding: 14,

        marginBottom: 12,

    },


    itemTopRow: {

        flexDirection: "row",

        alignItems: "center",

    },


    itemNumberBox: {

        width: 34,

        height: 34,

        borderRadius: 17,

        backgroundColor: "#EAF4FF",

        justifyContent: "center",

        alignItems: "center",

        marginRight: 11,

    },


    itemNumber: {

        fontSize: 14,

        fontWeight: "800",

        color: "#075CA8",

    },


    itemInfo: {

        flex: 1,

    },


    itemName: {

        fontSize: 16,

        fontWeight: "700",

        color: "#1E293B",

    },


    itemRate: {

        fontSize: 13,

        color: "#64748B",

        marginTop: 4,

    },


    deleteButton: {

        width: 38,

        height: 38,

        borderRadius: 19,

        backgroundColor: "#FFF1F1",

        justifyContent: "center",

        alignItems: "center",

    },


    divider: {

        height: 1,

        backgroundColor: "#EDF1F5",

        marginVertical: 13,

    },


    // ==========================================
    // BOTTOM ROW
    // ==========================================

    itemBottomRow: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

    },


    quantityContainer: {

        flexDirection: "row",

        alignItems: "center",

        gap: 10,

    },


    quantityLabel: {

        fontSize: 13,

        color: "#64748B",

        fontWeight: "600",

    },


    quantityControls: {

        flexDirection: "row",

        alignItems: "center",

        borderWidth: 1,

        borderColor: "#D8E1EA",

        borderRadius: 8,

        overflow: "hidden",

    },


    quantityButton: {

        width: 34,

        height: 34,

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#F8FAFC",

    },


    // ===== QUANTITY INPUT =====

    quantityInput: {

        width: 40,

        height: 34,

        textAlign: "center",

        fontSize: 15,

        fontWeight: "700",

        color: "#1E293B",

        backgroundColor: "#FFFFFF",

        padding: 0,

    },


    totalContainer: {

        alignItems: "flex-end",

    },


    totalLabel: {

        fontSize: 12,

        color: "#64748B",

        marginBottom: 4,

    },


    itemTotal: {

        fontSize: 17,

        fontWeight: "800",

        color: "#087A45",

    },


    // ==========================================
    // MODAL
    // ==========================================

    modalOverlay: {

        flex: 1,

        backgroundColor: "rgba(0,0,0,0.5)",

        justifyContent: "center",

        alignItems: "center",

    },


    modalContainer: {

        width: "90%",

        backgroundColor: "#FFFFFF",

        borderRadius: 20,

        padding: 24,

        elevation: 5,

    },


    modalHeader: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 20,

    },


    modalTitle: {

        fontSize: 20,

        fontWeight: "800",

        color: "#1E293B",

    },


    modalCloseButton: {

        padding: 5,

    },


    modalLabel: {

        fontSize: 14,

        fontWeight: "600",

        color: "#475569",

        marginBottom: 6,

        marginTop: 12,

    },


    modalInput: {

        borderWidth: 1,

        borderColor: "#D8E1EA",

        borderRadius: 10,

        padding: 12,

        fontSize: 16,

        color: "#1E293B",

    },


    modalQuantityContainer: {

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 12,

        marginTop: 8,

    },


    modalQuantityButton: {

        width: 44,

        height: 44,

        borderRadius: 22,

        borderWidth: 1,

        borderColor: "#075CA8",

        justifyContent: "center",

        alignItems: "center",

    },


    modalQuantityInput: {

        width: 60,

        height: 44,

        borderWidth: 1,

        borderColor: "#D8E1EA",

        borderRadius: 10,

        fontSize: 18,

        fontWeight: "700",

        color: "#1E293B",

        padding: 0,

        textAlign: "center",

    },


    modalAddButton: {

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#075CA8",

        paddingVertical: 14,

        borderRadius: 12,

        marginTop: 24,

        gap: 8,

    },


    modalAddText: {

        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "700",

    },

    autocompleteWrapper: {

        position: "relative",

        zIndex: 1,

    },

    suggestionDropdown: {

        position: "absolute",

        top: "100%",

        left: 0,

        right: 0,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#D8E1EA",

        borderTopWidth: 0,

        borderBottomLeftRadius: 10,

        borderBottomRightRadius: 10,

        maxHeight: 200,

        elevation: 5,

        shadowColor: "#000",

        shadowOffset: { width: 0, height: 2 },

        shadowOpacity: 0.15,

        shadowRadius: 4,

        zIndex: 999,

    },

    suggestionItem: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        paddingVertical: 12,

        paddingHorizontal: 14,

        borderBottomWidth: 1,

        borderBottomColor: "#F1F3F5",

    },

    suggestionName: {

        fontSize: 15,

        fontWeight: "600",

        color: "#1E293B",

        flex: 1,

    },

    suggestionPrice: {

        fontSize: 14,

        fontWeight: "700",

        color: "#087A45",

        marginLeft: 10,

    },

});