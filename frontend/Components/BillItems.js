import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


const BillItems = ({
    items = [],
}) => {


    const getItemTotal = (item) => {

        if (item.total !== undefined) {

            return Number(
                item.total
            ) || 0;

        }


        const quantity =
            Number(item.quantity) || 0;

        const price =
            Number(
                item.price ||
                item.rate ||
                item.amount
            ) || 0;


        return quantity * price;

    };


    return (

        <View style={styles.container}>


            {/* TABLE HEADER */}

            <View style={styles.headerRow}>

                <Text style={[styles.headerText, styles.numberColumn]}>
                    #
                </Text>


                <Text style={[styles.headerText, styles.nameColumn]}>
                    Item Name
                </Text>


                <Text style={[styles.headerText, styles.qtyColumn]}>
                    Qty
                </Text>


                <Text style={[styles.headerText, styles.unitColumn]}>
                    Unit
                </Text>


                <Text style={[styles.headerText, styles.priceColumn]}>
                    Price
                </Text>


                <Text style={[styles.headerText, styles.amountColumn]}>
                    Amount
                </Text>

            </View>


            {/* ITEMS */}

            {
                items.map((item, index) => {

                    const quantity =
                        Number(
                            item.quantity || 1
                        );


                    const price =
                        Number(
                            item.price ||
                            item.rate ||
                            0
                        );


                    const itemTotal =
                        getItemTotal(item);


                    return (

                        <View
                            key={
                                item.id ||
                                index.toString()
                            }
                            style={styles.itemRow}
                        >


                            <Text
                                style={[
                                    styles.cell,
                                    styles.numberColumn,
                                ]}
                            >
                                {index + 1}
                            </Text>


                            <Text
                                style={[
                                    styles.itemName,
                                    styles.nameColumn,
                                ]}
                            >
                                {
                                    item.name ||
                                    item.itemName ||
                                    "Item"
                                }
                            </Text>


                            <Text
                                style={[
                                    styles.cell,
                                    styles.qtyColumn,
                                ]}
                            >
                                {quantity}
                            </Text>


                            <Text
                                style={[
                                    styles.cell,
                                    styles.unitColumn,
                                ]}
                            >
                                {
                                    item.unit ||
                                    "Pcs"
                                }
                            </Text>


                            <Text
                                style={[
                                    styles.cell,
                                    styles.priceColumn,
                                ]}
                            >
                                ₹{price.toFixed(2)}
                            </Text>


                            <Text
                                style={[
                                    styles.cell,
                                    styles.amountColumn,
                                ]}
                            >
                                ₹{itemTotal.toFixed(2)}
                            </Text>

                        </View>

                    );

                })
            }


            {/* EMPTY */}

            {
                items.length === 0 && (

                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyText}>
                            No items added
                        </Text>

                    </View>

                )
            }

        </View>

    );

};


export default BillItems;


const styles = StyleSheet.create({

    container: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#E2E2E2",
    },


    headerRow: {
        flexDirection: "row",
        backgroundColor: "#5D5A7B",
        minHeight: 42,
        alignItems: "center",
    },


    headerText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center",
        paddingHorizontal: 3,
    },


    itemRow: {
        flexDirection: "row",
        minHeight: 48,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E7E7E7",
    },


    cell: {
        fontSize: 10,
        color: "#333",
        textAlign: "center",
        paddingHorizontal: 2,
    },


    itemName: {
        fontSize: 11,
        fontWeight: "600",
        color: "#222",
        paddingHorizontal: 5,
    },


    numberColumn: {
        width: "7%",
    },


    nameColumn: {
        width: "35%",
    },


    qtyColumn: {
        width: "10%",
    },


    unitColumn: {
        width: "12%",
    },


    priceColumn: {
        width: "17%",
    },


    amountColumn: {
        width: "19%",
    },


    emptyContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },


    emptyText: {
        fontSize: 13,
        color: "#999",
    },

});