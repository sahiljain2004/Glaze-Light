import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from '../services/api';

const AddItemScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isEditMode = route.params?.isEditMode || false;
    const editItem = route.params?.editItem || null;

    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("Lighting");
    const [unit, setUnit] = useState("PCS");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && editItem) {
            setItemName(editItem.name || "");
            setCategory(editItem.category || "Lighting");
            setUnit(editItem.unit || "PCS");
            setPrice(String(editItem.price || ""));
            setStock(String(editItem.stock || ""));
        }
    }, [isEditMode, editItem]);

    const handleUpdateItem = async () => {
        if (itemName.trim() === "") {
            Alert.alert("Required", "Please enter item name");
            return;
        }
        if (price.trim() === "" || Number(price) <= 0) {
            Alert.alert("Required", "Please enter valid price");
            return;
        }
        if (stock.trim() === "" || Number(stock) < 0) {
            Alert.alert("Required", "Please enter valid stock quantity");
            return;
        }

        setLoading(true);

        const itemData = {
            name: itemName.trim(),
            category: category,
            unit: unit,
            price: Number(price),
            stock: Number(stock),
        };

        try {
            const { data } = await api.put(`/api/items/${editItem.id}`, itemData);

            if (data.success) {
                Alert.alert(
                    "Success",
                    `${itemName} updated successfully!`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.navigate("ItemsScreen", {
                                    updatedItem: {
                                        id: editItem.id,
                                        ...itemData
                                    }
                                });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert("Error", data.message || "Failed to update item");
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert("Error", "Could not update item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveItem = async () => {
        if (itemName.trim() === "") {
            Alert.alert("Required", "Please enter item name");
            return;
        }
        if (price.trim() === "" || Number(price) <= 0) {
            Alert.alert("Required", "Please enter valid price");
            return;
        }
        if (stock.trim() === "" || Number(stock) < 0) {
            Alert.alert("Required", "Please enter valid stock quantity");
            return;
        }

        setLoading(true);

        const itemData = {
            name: itemName.trim(),
            category: category,
            unit: unit,
            price: Number(price),
            stock: Number(stock),
        };

        try {
            const { data } = await api.post('/api/items', itemData);

            if (data.success) {
                Alert.alert(
                    "Success",
                    `${itemName} added successfully!`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.navigate("ItemsScreen", {
                                    newItem: data.item || {
                                        id: data.itemId,
                                        ...itemData
                                    }
                                });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert("Error", data.message || "Failed to add item");
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert("Error", "Could not add item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleUpdateItem();
        } else {
            handleSaveItem();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditMode ? "Edit Item" : "Add New Item"}
                </Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Item Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter item name"
                    placeholderTextColor="#999"
                    value={itemName}
                    onChangeText={setItemName}
                />

                <Text style={styles.label}>Select Category</Text>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.optionButton, category === "Lighting" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setCategory("Lighting")}
                    >
                        <Text style={[styles.optionText, category === "Lighting" ? styles.activeText : null]}>Lighting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, category === "Electrical" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setCategory("Electrical")}
                    >
                        <Text style={[styles.optionText, category === "Electrical" ? styles.activeText : null]}>Electrical</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, category === "Smart Lights" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setCategory("Smart Lights")}
                    >
                        <Text style={[styles.optionText, category === "Smart Lights" ? styles.activeText : null]}>Smart Lights</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Select Unit</Text>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.optionButton, unit === "PCS" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setUnit("PCS")}
                    >
                        <Text style={[styles.optionText, unit === "PCS" ? styles.activeText : null]}>PCS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, unit === "KG" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setUnit("KG")}
                    >
                        <Text style={[styles.optionText, unit === "KG" ? styles.activeText : null]}>KG</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, unit === "Litre" ? styles.activeButton : null]}
                        activeOpacity={0.7}
                        onPress={() => setUnit("Litre")}
                    >
                        <Text style={[styles.optionText, unit === "Litre" ? styles.activeText : null]}>Litre</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter item price"
                    placeholderTextColor="#999"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Stock Quantity *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter stock quantity"
                    placeholderTextColor="#999"
                    value={stock}
                    onChangeText={setStock}
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.saveText}>
                            {isEditMode ? "Update Item" : "Save Item"}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AddItemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        height: 70,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        elevation: 3,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#EAF8FC",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    backText: {
        fontSize: 32,
        color: "#1AA4E8",
        fontWeight: "600",
        marginTop: -4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginTop: 18,
        marginBottom: 8,
    },
    input: {
        height: 55,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#222",
        borderWidth: 1,
        borderColor: "#E3E3E3",
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    optionButton: {
        width: "31%",
        height: 52,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E3E3E3",
        paddingHorizontal: 5,
    },
    activeButton: {
        backgroundColor: "#1AA4E8",
        borderColor: "#1AA4E8",
    },
    optionText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#555",
        textAlign: "center",
    },
    activeText: {
        color: "#FFFFFF",
    },
    saveButton: {
        height: 55,
        backgroundColor: "#1AA4E8",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    saveButtonDisabled: {
        backgroundColor: "#A0C4E8",
    },
    saveText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
});
