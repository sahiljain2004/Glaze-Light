import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';

const SaleInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    editable = true,
    multiline = false,
    suggestions = [],
    onSelectSuggestion,
    showSuggestions = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => {
                if (onSelectSuggestion) {
                    onSelectSuggestion(item);
                }
                setIsFocused(false);
            }}
        >
            <Text style={styles.suggestionName}>{item.name}</Text>
            <View style={styles.suggestionDetails}>
                <Text style={styles.suggestionPrice}>₹{item.price}</Text>
                <Text style={styles.suggestionStock}>Stock: {item.stock}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                ref={inputRef}
                style={[
                    styles.input,
                    !editable && styles.inputDisabled,
                    multiline && styles.inputMultiline,
                ]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
                editable={editable}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    // Delay to allow suggestion selection
                    setTimeout(() => setIsFocused(false), 200);
                }}
            />

            {showSuggestions && suggestions.length > 0 && isFocused && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderSuggestion}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#222',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        minHeight: 50,
    },
    inputDisabled: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    suggestionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        maxHeight: 200,
        marginTop: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    suggestionName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        flex: 1,
    },
    suggestionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    suggestionPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#075CA8',
    },
    suggestionStock: {
        fontSize: 12,
        color: '#666',
    },
});

export default SaleInput;