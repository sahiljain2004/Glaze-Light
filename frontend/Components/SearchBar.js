import React from "react";

import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const SearchBar = ({
    value,
    onChangeText,
    onFilterPress,
    placeholder = "Search for a transaction",
}) => {

    return (

        <View style={styles.container}>

            {/* SEARCH ICON */}

            <View
                style={
                    styles.searchIconContainer
                }
            >

                <Feather
                    name="search"
                    size={22}
                    color="#1AA4E8"
                />

            </View>


            {/* TEXT INPUT */}

            <TextInput

                value={value}

                onChangeText={
                    onChangeText
                }

                placeholder={
                    placeholder
                }

                placeholderTextColor="#A0A0A0"

                style={
                    styles.input
                }

                autoCorrect={false}

                autoCapitalize="none"

                keyboardType="default"

                returnKeyType="search"

                blurOnSubmit={false}

            />


            {/* FILTER BUTTON */}

            <TouchableOpacity

                activeOpacity={0.7}

                style={
                    styles.filterButton
                }

                onPress={
                    onFilterPress
                }

            >

                <Feather
                    name="filter"
                    size={21}
                    color="#1AA4E8"
                />

            </TouchableOpacity>

        </View>

    );

};


export default SearchBar;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {

        height: 58,

        marginHorizontal: 16,

        marginTop: 18,

        backgroundColor: "#FFFFFF",

        borderRadius: 16,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 12,

        elevation: 3,

        shadowColor: "#000",

        shadowOpacity: 0.06,

        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: 2,
        },

    },


    searchIconContainer: {

        width: 38,

        height: 38,

        borderRadius: 12,

        backgroundColor: "#EAF8FC",

        justifyContent: "center",

        alignItems: "center",

    },


    input: {

        flex: 1,

        height: 50,

        marginLeft: 10,

        paddingHorizontal: 0,

        paddingVertical: 0,

        fontSize: 15,

        color: "#333",

    },


    filterButton: {

        width: 40,

        height: 40,

        borderRadius: 12,

        backgroundColor: "#EAF8FC",

        justifyContent: "center",

        alignItems: "center",

    },

});