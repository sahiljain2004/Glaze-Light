import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


const BillCustomerInfo = ({
    saleData,
}) => {

    return (

        <View style={styles.container}>


            {/* BILL TO */}

            <View style={styles.leftSection}>

                <Text style={styles.heading}>
                    Bill To
                </Text>


                <Text style={styles.customerName}>
                    {
                        saleData?.customerName ||
                        saleData?.name ||
                        "Customer Name"
                    }
                </Text>


                {
                    saleData?.phoneNumber ? (

                        <Text style={styles.detail}>
                            Contact No.: {saleData.phoneNumber}
                        </Text>

                    ) : null
                }


                {
                    saleData?.address ? (

                        <Text style={styles.detail}>
                            {saleData.address}
                        </Text>

                    ) : null
                }

            </View>


            {/* INVOICE DETAILS */}

            <View style={styles.rightSection}>

                <Text style={styles.heading}>
                    Invoice Details
                </Text>


                <Text style={styles.invoiceDetail}>

                    Invoice No.:{" "}

                    {
                        saleData?.invoiceNumber ||
                        saleData?.transactionNumber ||
                        "7155"
                    }

                </Text>


                <Text style={styles.invoiceDetail}>

                    Date:{" "}

                    {
                        saleData?.date ||
                        new Date().toLocaleDateString(
                            "en-IN"
                        )
                    }

                </Text>

            </View>

        </View>

    );

};


export default BillCustomerInfo;


const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 18,
    },


    leftSection: {
        flex: 1.3,
        paddingRight: 10,
    },


    rightSection: {
        flex: 1,
        alignItems: "flex-end",
    },


    heading: {
        fontSize: 13,
        fontWeight: "800",
        color: "#333",
        marginBottom: 9,
    },


    customerName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
        marginBottom: 8,
    },


    detail: {
        fontSize: 12,
        color: "#555",
        marginBottom: 5,
    },


    invoiceDetail: {
        fontSize: 11,
        color: "#555",
        marginBottom: 6,
        textAlign: "right",
    },

});