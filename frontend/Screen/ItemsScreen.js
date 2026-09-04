import React, {
    useState,
    useEffect,
    useCallback,
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
    useFocusEffect,
} from "@react-navigation/native";
import api from '../services/api';

import AppButton from "../Components/AppButton";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import ItemCategory from "../Components/ItemCategory";
import ItemCard from "../Components/ItemCard";
import BottomNav from "../Components/BottomNav";

const ItemsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItems = async () => {
        try {
            setLoading(true);

            const { data } = await api.get('/api/items');

            if (data.success) {
                setItems(data.items || []);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    useEffect(() => {
        const newItem = route.params?.newItem;
        if (!newItem) return;

        setItems((previousItems) => {
            const alreadyExists = previousItems.some((item) => item.id === newItem.id);
            if (alreadyExists) return previousItems;
            return [newItem, ...previousItems];
        });

        navigation.setParams({ newItem: undefined });
    }, [route.params?.newItem, navigation]);

    const handleDeleteItem = async (itemId, itemName) => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to delete "${itemName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { data } = await api.delete(`/api/items/${itemId}`);

                            if (data.success) {
                                Alert.alert('Success', 'Item deleted successfully');
                                setItems(prev => prev.filter(item => item.id !== itemId));
                            } else {
                                Alert.alert('Error', data.message || 'Failed to delete');
                            }
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Could not delete item');
                        }
                    },
                },
            ]
        );
    };

    const handleEditItem = (item) => {
        navigation.navigate('AddItemScreen', {
            editItem: item,
            isEditMode: true,
        });
    };

    const filteredItems = items.filter((item) => {
        const searchText = search.trim().toLowerCase();
        const itemName = String(item.name || "").toLowerCase();
        const itemCategory = String(item.category || "").toLowerCase();
        const searchMatch = itemName.includes(searchText) || itemCategory.includes(searchText);
        const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
        return searchMatch && categoryMatch;
    });

    const handleFilterPress = useCallback(() => {
        Alert.alert("Filter", "Filter options yaha open honge.");
    }, []);

    const handleAddItem = useCallback(() => {
        navigation.navigate("AddItemScreen");
    }, [navigation]);

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#1AA4E8" />
                </View>
            );
        }
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items found</Text>
                <Text style={styles.emptySubText}>Add a new item to get started</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header />

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1AA4E8']}
                        tintColor="#1AA4E8"
                    />
                }
                ListHeaderComponent={
                    <View>
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            onFilterPress={handleFilterPress}
                            placeholder="Search item"
                        />
                        <View style={styles.categoryContainer}>
                            <ItemCategory
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <ItemCard
                        id={item.id}
                        name={item.name}
                        category={item.category}
                        price={String(item.price)}
                        stock={String(item.stock)}
                        onEdit={() => handleEditItem(item)}
                        onDelete={() => handleDeleteItem(item.id, item.name)}
                    />
                )}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.listContent}
            />

            <AppButton
                title="Add Item"
                backgroundColor="#1AA4E8"
                icon="plus"
                onPress={handleAddItem}
                style={styles.addButton}
            />

            <BottomNav />
        </View>
    );
};

export default ItemsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
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
    categoryContainer: {
        marginTop: 18,
        marginBottom: 8,
    },
    listContent: {
        paddingBottom: 140,
    },
    emptyContainer: {
        height: 180,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#999",
    },
    emptySubText: {
        fontSize: 14,
        color: "#BBB",
        marginTop: 8,
    },
});
