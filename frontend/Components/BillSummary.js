import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


const BillSummary = ({
    saleData,
}) => {
    const numberToWords = (num) => {
        const a = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
        ];
        const b = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];

        const inWords = (n) => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
            if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
            if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
            if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
            return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
        };

        const rupees = Math.floor(num);
        return rupees === 0 ? "Zero" : inWords(rupees);
    };
    const totalAmount = Number(saleData?.totalAmount || saleData?.amount || 0);
    const amountInWords = `Rupees ${numberToWords(totalAmount)} Only`;


    const receivedAmount =
        Number(
            saleData?.receivedAmount ||
            0
        );


    const dueAmount =
        Number(
            saleData?.dueAmount ||
            saleData?.balance ||
            0
        );


    return (

        <View style={styles.container}>


            {/* TOTAL QUANTITY */}

            <View style={styles.totalQuantityRow}>

                <Text style={styles.totalLabel}>
                    Total
                </Text>


                <Text style={styles.totalValue}>
                    {
                        (saleData?.items || [])
                            .reduce(
                                (total, item) =>
                                    total +
                                    Number(
                                        item.quantity || 0
                                    ),
                                0
                            )
                    }
                </Text>

            </View>


            <View style={styles.line} />


            {/* BOTTOM DETAILS */}

            <View style={styles.bottomSection}>


                {/* LEFT */}

                <View style={styles.leftSection}>


                    <Text style={styles.sectionHeading}>
                        Invoice Amount In Words
                    </Text>


                    <Text style={styles.wordsText}>
                         {
                           amountInWords
                            
                        } 
                    </Text>


                    {
                        saleData?.description ? (

                            <>

                                <Text
                                    style={[
                                        styles.sectionHeading,
                                        styles.descriptionHeading,
                                    ]}
                                >
                                    Description
                                </Text>


                                <Text style={styles.descriptionText}>
                                    {saleData.description}
                                </Text>

                            </>

                        ) : null
                    }


                    <Text
                        style={[
                            styles.sectionHeading,
                            styles.termsHeading,
                        ]}
                    >
                        Terms And Conditions
                    </Text>


                    <Text style={styles.descriptionText}>
                        Goods once sold will not be returned.
                    </Text>


                    <Text style={styles.descriptionText}>
                        Please keep this invoice for future reference.
                    </Text>

                </View>


                {/* RIGHT */}

                <View style={styles.rightSection}>


                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Sub Total
                        </Text>

                        <Text style={styles.summaryValue}>
                            ₹ {totalAmount.toFixed(2)}
                        </Text>

                    </View>


                    <View style={styles.totalRow}>

                        <Text style={styles.totalText}>
                            Total
                        </Text>

                        <Text style={styles.totalText}>
                            ₹ {totalAmount.toFixed(2)}
                        </Text>

                    </View>


                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Received
                        </Text>

                        <Text style={styles.summaryValue}>
                            ₹ {receivedAmount.toFixed(2)}
                        </Text>

                    </View>


                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Balance
                        </Text>

                        <Text style={styles.summaryValue}>
                            ₹ {dueAmount.toFixed(2)}
                        </Text>

                    </View>


                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Payment Mode
                        </Text>

                        <Text style={styles.summaryValue}>
                            {
                                saleData?.paymentMethod ||
                                "Cash"
                            }
                        </Text>

                    </View>


                    <View style={styles.signatureLine} />


                    <Text style={styles.forText}>
                        For: Glaze Lights NX
                    </Text>


                    <View style={styles.signatureSpace} />


                    <Text style={styles.signatureText}>
                        Authorized Signatory
                    </Text>

                </View>

            </View>

        </View>

    );

};


export default BillSummary;


const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 18,
        paddingBottom: 25,
    },


    totalQuantityRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 5,
    },


    totalLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#222",
    },


    totalValue: {
        fontSize: 14,
        fontWeight: "800",
        color: "#222",
        marginRight: "42%",
    },


    line: {
        height: 1,
        backgroundColor: "#333",
    },


    bottomSection: {
        flexDirection: "row",
        paddingTop: 18,
    },


    leftSection: {
        flex: 1.15,
        paddingRight: 10,
    },


    rightSection: {
        flex: 1,
    },


    sectionHeading: {
        fontSize: 12,
        fontWeight: "800",
        color: "#333",
        marginBottom: 8,
    },


    wordsText: {
        fontSize: 11,
        color: "#444",
        lineHeight: 18,
    },


    descriptionHeading: {
        marginTop: 20,
    },


    termsHeading: {
        marginTop: 20,
    },


    descriptionText: {
        fontSize: 10,
        color: "#555",
        marginBottom: 5,
        lineHeight: 16,
    },


    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },


    summaryLabel: {
        fontSize: 11,
        color: "#444",
    },


    summaryValue: {
        fontSize: 11,
        color: "#333",
        fontWeight: "600",
    },


    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#5D5A7B",
        paddingVertical: 7,
        paddingHorizontal: 7,
        marginVertical: 4,
    },


    totalText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#FFFFFF",
    },


    signatureLine: {
        height: 1,
        backgroundColor: "#777",
        marginTop: 8,
    },


    forText: {
        fontSize: 11,
        color: "#444",
        marginTop: 15,
        textAlign: "center",
    },


    signatureSpace: {
        height: 55,
    },


    signatureText: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "800",
        color: "#333",
    },

});