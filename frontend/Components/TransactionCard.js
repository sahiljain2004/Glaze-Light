import React, { memo } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const TransactionCard = ({
    id,
    name,
    amount,
    balance,
    transactionNumber,
    date,
    onPress,
    onPrint,
    onEdit,
    onDelete,
}) => {

    // ==========================================
    // HANDLE DELETE
    // ==========================================

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            `Are you sure you want to delete "${name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        if (onDelete) {
                            onDelete(id);
                        }
                    },
                },
            ]
        );
    };

    // ==========================================
    // HANDLE EDIT
    // ==========================================

    const handleEdit = () => {
        if (onEdit) {
            onEdit(id);
        }
    };

    // ==========================================
    // HANDLE MORE OPTIONS
    // ==========================================

    const handleMore = () => {
        Alert.alert(
            "Options",
            `What would you like to do with "${name}"?`,
            [
                {
                    text: "Edit",
                    onPress: handleEdit,
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDelete,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    // ==========================================
    // AMOUNT CALCULATION
    // ==========================================

    const total =
        Number(
            String(amount || 0)
                .replace(/,/g, "")
        ) || 0;


    const dueBalance =
        Number(
            String(balance || 0)
                .replace(/,/g, "")
        ) || 0;


    return (

        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={onPress}
        >

            {/* ================= TOP ================= */}

            <View
                style={styles.topRow}
            >

                <View>

                    <Text
                        style={styles.name}
                    >
                        {name}
                    </Text>


                    <View
                        style={styles.saleBadge}
                    >

                        <Text
                            style={styles.saleText}
                        >
                            SALE
                        </Text>

                    </View>

                </View>


                <View
                    style={styles.dateSection}
                >

                    <Text
                        style={
                            styles.transactionNo
                        }
                    >
                        #{transactionNumber}
                    </Text>


                    <Text
                        style={styles.date}
                    >
                        {date}
                    </Text>

                </View>

            </View>


            {/* ================= BOTTOM ================= */}

            <View
                style={styles.bottomRow}
            >


                {/* TOTAL */}

                <View>

                    <Text
                        style={styles.label}
                    >
                        Total
                    </Text>


                    <Text
                        style={styles.amount}
                    >
                        ₹ {total.toFixed(2)}
                    </Text>

                </View>


                {/* BALANCE */}

                <View
                    style={styles.balanceBox}
                >

                    <Text
                        style={styles.label}
                    >
                        Balance
                    </Text>


                    <Text
                        style={[
                            styles.amount,

                            dueBalance === 0 &&
                            styles.paidAmount,
                        ]}
                    >
                        ₹ {dueBalance.toFixed(2)}
                    </Text>

                </View>


                {/* ================= ACTIONS ================= */}

                <View
                    style={styles.actions}
                >


                    {/* PRINT */}

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onPrint}
                    >
                        <Feather
                            name="printer"
                            size={25}
                            color="#666"
                        />
                    </TouchableOpacity>


                    {/* SHARE */}

                    <TouchableOpacity
                        style={
                            styles.actionButton
                        }
                        onPress={() => {
                        }}
                    >

                        <Feather
                            name="share"
                            size={25}
                            color="#666"
                        />

                    </TouchableOpacity>


                    {/* MORE (Edit/Delete) */}

                    <TouchableOpacity
                        style={
                            styles.actionButton
                        }
                        onPress={handleMore}
                    >

                        <Feather
                            name="more-vertical"
                            size={25}
                            color="#666"
                        />

                    </TouchableOpacity>


                </View>

            </View>


        </TouchableOpacity>

    );

};


export default memo(TransactionCard);


// ==========================================
// STYLES
// ==========================================

const styles =
    StyleSheet.create({

        card: {

            backgroundColor:
                "#FFFFFF",

            marginHorizontal:
                16,

            marginTop:
                14,

            borderRadius:
                20,

            padding:
                18,

            elevation:
                4,

            shadowColor:
                "#000",

            shadowOpacity:
                0.08,

            shadowRadius:
                10,

            shadowOffset: {
                width: 0,
                height: 3,
            },

        },


        topRow: {

            flexDirection:
                "row",

            justifyContent:
                "space-between",

        },


        name: {

            fontSize:
                18,

            fontWeight:
                "700",

            color:
                "#333",

        },


        saleBadge: {

            marginTop:
                10,

            backgroundColor:
                "#E7F8EF",

            paddingHorizontal:
                13,

            paddingVertical:
                6,

            borderRadius:
                20,

            alignSelf:
                "flex-start",

        },


        saleText: {

            color:
                "#27A86B",

            fontSize:
                12,

            fontWeight:
                "700",

        },


        dateSection: {

            alignItems:
                "flex-end",

        },


        transactionNo: {

            color:
                "#999",

            fontSize:
                13,

            fontWeight:
                "600",

        },


        date: {

            color:
                "#999",

            fontSize:
                13,

            marginTop:
                8,

        },


        bottomRow: {

            flexDirection:
                "row",

            alignItems:
                "flex-end",

            justifyContent:
                "space-between",

            marginTop:
                22,

        },


        label: {

            color:
                "#999",

            fontSize:
                13,

            marginBottom:
                6,

        },


        amount: {

            color:
                "#333",

            fontSize:
                17,

            fontWeight:
                "700",

        },


        paidAmount: {

            color:
                "#27A86B",

        },


        balanceBox: {

            marginLeft:
                10,

        },


        actions: {

            flexDirection:
                "row",

            alignItems:
                "center",

        },


        actionButton: {

            marginLeft:
                12,

            padding:
                3,

        },

    });