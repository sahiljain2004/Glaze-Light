import React from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";


const categories = [
    "All",
    "Lighting",
    "Electrical",
    "Smart Lights",
];


const ItemCategory = ({
    selectedCategory,
    setSelectedCategory,
}) => {

    return (

        <View style={styles.container}>

            {/* TITLE */}

            <Text style={styles.title}>
                Categories
            </Text>


            {/* CATEGORY LIST */}

            <ScrollView

                horizontal

                showsHorizontalScrollIndicator={
                    false
                }

                keyboardShouldPersistTaps="always"

                contentContainerStyle={
                    styles.categoryList
                }

            >

                {categories.map(
                    (category) => {

                        const isActive =
                            selectedCategory ===
                            category;


                        return (

                            <TouchableOpacity

                                key={category}

                                activeOpacity={0.8}

                                onPress={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }

                                style={[
                                    styles.category,

                                    isActive &&
                                    styles.activeCategory,
                                ]}

                            >

                                <Text

                                    style={[
                                        styles.categoryText,

                                        isActive &&
                                        styles.activeText,
                                    ]}

                                >

                                    {category}

                                </Text>

                            </TouchableOpacity>

                        );

                    }
                )}

            </ScrollView>

        </View>
    );
};


export default ItemCategory;


const styles = StyleSheet.create({

    container: {

        paddingHorizontal: 16,

    },


    title: {

        fontSize: 17,

        fontWeight: "700",

        color: "#222",

        marginBottom: 12,

    },


    categoryList: {

        paddingRight: 16,

    },


    category: {

        height: 42,

        paddingHorizontal: 18,

        borderRadius: 22,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E5E5E5",

        justifyContent: "center",

        alignItems: "center",

        marginRight: 10,

    },


    activeCategory: {

        backgroundColor: "#1AA4E8",

        borderColor: "#1AA4E8",

    },


    categoryText: {

        fontSize: 13,

        fontWeight: "600",

        color: "#777",

    },


    activeText: {

        color: "#FFFFFF",

    },

});