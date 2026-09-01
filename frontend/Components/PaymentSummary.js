import React from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";


const PaymentSummary = ({
    totalAmount,
    receivedAmount,
    setReceivedAmount,
}) => {

    const received =
        Number(receivedAmount) || 0;


    const dueAmount =
        Math.max(
            totalAmount - received,
            0
        );


    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Payment Details
            </Text>


            {/* TOTAL */}

            <View style={styles.row}>

                <Text style={styles.label}>
                    Total Amount
                </Text>

                <Text style={styles.totalAmount}>
                    ₹ {totalAmount.toFixed(2)}
                </Text>

            </View>


            {/* RECEIVED */}

            <View style={styles.receivedContainer}>

                <Text style={styles.label}>
                    Received Amount
                </Text>

                <View style={styles.inputContainer}>

                    <Text style={styles.rupee}>
                        ₹
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter received amount"
                        placeholderTextColor="#999"
                        value={receivedAmount}
                        onChangeText={setReceivedAmount}
                        keyboardType="numeric"
                    />

                </View>

            </View>


            {/* DUE */}

            <View style={styles.dueContainer}>

                <Text style={styles.dueLabel}>
                    Due Amount
                </Text>

                <Text style={styles.dueAmount}>
                    ₹ {dueAmount.toFixed(2)}
                </Text>

            </View>

        </View>

    );

};


export default PaymentSummary;


const styles = StyleSheet.create({

    container: {

        backgroundColor: "#FFFFFF",

        marginTop: 15,

        padding: 16,

        borderRadius: 12,

        borderWidth: 1,

        borderColor: "#E5E5E5",

    },


    title: {

        fontSize: 18,

        fontWeight: "700",

        color: "#222",

        marginBottom: 15,

    },


    row: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 15,

    },


    label: {

        fontSize: 15,

        fontWeight: "600",

        color: "#555",

    },


    totalAmount: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222",

    },


    receivedContainer: {

        marginBottom: 15,

    },


    inputContainer: {

        height: 52,

        borderWidth: 1,

        borderColor: "#D9DDE2",

        borderRadius: 8,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 14,

        marginTop: 8,

    },


    rupee: {

        fontSize: 18,

        fontWeight: "700",

        color: "#075CA8",

        marginRight: 8,

    },


    input: {

        flex: 1,

        fontSize: 16,

        color: "#222",

    },


    dueContainer: {

        backgroundColor: "#FFF3F3",

        padding: 14,

        borderRadius: 8,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

    },


    dueLabel: {

        fontSize: 16,

        fontWeight: "700",

        color: "#C62828",

    },


    dueAmount: {

        fontSize: 19,

        fontWeight: "800",

        color: "#C62828",

    },

});