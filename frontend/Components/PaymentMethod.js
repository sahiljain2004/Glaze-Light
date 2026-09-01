import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const PaymentMethod = ({
    paymentMethod,
    setPaymentMethod,
    isReceived,
    onPaymentReceived,
}) => {
    const methods = [

        "Cash",

        "UPI",

        "Card",

        "Bank",

    ];


    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Payment Method
            </Text>


            {/* PAYMENT METHODS */}

            <View style={styles.methodContainer}>

                {methods.map((method) => (

                    <TouchableOpacity
                        key={method}
                        style={[
                            styles.methodButton,

                            paymentMethod === method &&
                            styles.activeMethod,
                        ]}
                        onPress={() =>
                            setPaymentMethod(
                                method
                            )
                        }
                    >

                        <Text
                            style={[
                                styles.methodText,

                                paymentMethod === method &&
                                styles.activeMethodText,
                            ]}
                        >
                            {method}
                        </Text>

                    </TouchableOpacity>

                ))}

            </View>


            {/* PAYMENT RECEIVED CHECKBOX */}

            <TouchableOpacity
                style={styles.checkboxRow}
                onPress={onPaymentReceived}
            >

                <View
                    style={[
                        styles.checkbox,

                        isReceived &&
                        styles.checkedBox,
                    ]}
                >

                    {isReceived && (

                        <Feather
                            name="check"
                            size={17}
                            color="#FFFFFF"
                        />

                    )}

                </View>


                <Text style={styles.checkboxText}>
                    Payment received
                </Text>

            </TouchableOpacity>

        </View>

    );

};


export default PaymentMethod;


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


    methodContainer: {

        flexDirection: "row",

        flexWrap: "wrap",

        gap: 10,

    },


    methodButton: {

        paddingHorizontal: 18,

        paddingVertical: 11,

        borderRadius: 8,

        borderWidth: 1,

        borderColor: "#D9DDE2",

        backgroundColor: "#FFFFFF",

    },


    activeMethod: {

        backgroundColor: "#075CA8",

        borderColor: "#075CA8",

    },


    methodText: {

        fontSize: 14,

        fontWeight: "600",

        color: "#555",

    },


    activeMethodText: {

        color: "#FFFFFF",

    },


    checkboxRow: {

        flexDirection: "row",

        alignItems: "center",

        marginTop: 20,

    },


    checkbox: {

        width: 24,

        height: 24,

        borderWidth: 2,

        borderColor: "#075CA8",

        borderRadius: 5,

        justifyContent: "center",

        alignItems: "center",

        marginRight: 10,

    },


    checkedBox: {

        backgroundColor: "#075CA8",

    },


    checkboxText: {

        fontSize: 16,

        fontWeight: "600",

        color: "#333",

    },

});