import React, {
    useRef,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const ItemCard = ({
    id,
    name,
    category,
    price,
    stock,
    onEdit,
    onDelete,
}) => {

    const scaleAnim = useRef(
        new Animated.Value(1)
    ).current;


    const handlePressIn = () => {

        Animated.spring(scaleAnim, {

            toValue: 0.97,

            friction: 7,

            useNativeDriver: true,

        }).start();

    };


    const handlePressOut = () => {

        Animated.spring(scaleAnim, {

            toValue: 1,

            friction: 7,

            useNativeDriver: true,

        }).start();

    };


    const isLowStock =
        Number(stock) < 10;


    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                        <Feather name="edit-2" size={18} color="#1AA4E8" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                        <Feather name="trash-2" size={18} color="#E53935" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.category}>{category}</Text>
                <View style={styles.rightInfo}>
                    <Text style={styles.price}>₹{price}</Text>
                    <Text style={styles.stock}>Stock: {stock}</Text>
                </View>
            </View>
        </View>
    );
};



export default ItemCard;


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#F5F7FA',
        marginLeft: 4,
    },
    category: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    rightInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#075CA8',
    },
    stock: {
        fontSize: 13,
        color: '#666',
    },
});