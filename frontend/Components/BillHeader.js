import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


const BillHeader = () => {

    return (

        <View style={styles.container}>

            {/* COMPANY DETAILS */}

            <View style={styles.companySection}>

                <View style={styles.companyDetails}>

                    <Text style={styles.companyName}>
                        Glaze Lights NX
                    </Text>

                    <Text style={styles.companyType}>
                        (UNDER COMPOSITION)
                    </Text>


                    <Text style={styles.detail}>
                        Shop No. 94251, Near Food City
                    </Text>

                    <Text style={styles.detail}>
                        Kailash Lodge, Patankar Bazar
                    </Text>

                    <Text style={styles.detail}>
                        Gwalior, Madhya Pradesh
                    </Text>

                    <Text style={styles.detail}>
                        Phone: 9425115743
                    </Text>

                    <Text style={styles.detail}>
                        Email: info@glazelights.com
                    </Text>

                    <Text style={styles.detail}>
                        GSTIN: 23AHDPA5640E1Z0
                    </Text>

                </View>


                {/* LOGO */}

                <View style={styles.logoBox}>

                    <Text style={styles.logoText}>
                        G
                    </Text>

                    <Text style={styles.logoSubText}>
                        Glaze{"\n"}Lights
                    </Text>

                </View>

            </View>


            <View style={styles.line} />


            {/* INVOICE TITLE */}

            <Text style={styles.invoiceTitle}>
                Tax Invoice
            </Text>


            <View style={styles.line} />

        </View>

    );

};


export default BillHeader;


const styles = StyleSheet.create({

    container: {
        paddingTop: 20,
    },


    companySection: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
    },


    companyDetails: {
        flex: 1,
        paddingRight: 10,
    },


    companyName: {
        fontSize: 21,
        fontWeight: "800",
        color: "#202020",
    },


    companyType: {
        fontSize: 13,
        fontWeight: "700",
        color: "#444",
        marginTop: 2,
        marginBottom: 10,
    },


    detail: {
        fontSize: 11,
        color: "#555",
        marginBottom: 3,
    },


    logoBox: {
        width: 75,
        height: 75,
        borderRadius: 8,
        backgroundColor: "#302D42",
        justifyContent: "center",
        alignItems: "center",
    },


    logoText: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFFFF",
    },


    logoSubText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
        textAlign: "center",
    },


    line: {
        height: 1,
        backgroundColor: "#D8D8D8",
        marginTop: 15,
    },


    invoiceTitle: {
        textAlign: "center",
        fontSize: 21,
        fontWeight: "800",
        color: "#5B5878",
        paddingVertical: 12,
    },

});