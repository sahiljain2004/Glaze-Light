import React from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Feather } from "@react-native-vector-icons/feather/static";


const links = [

    {
        title: "Sale",
        icon: "trending-up",
    },

    {
        title: "Purchase",
        icon: "shopping-bag",
    },

    {
        title: "Expense",
        icon: "credit-card",
    },

    {
        title: "Reports",
        icon: "bar-chart-2",
    },

];


const DashboardQuickLinks = () => {

    return (

        <View style={styles.container}>

            <Text style={styles.heading}>
                Quick Actions
            </Text>


            <View style={styles.row}>

                {links.map((item) => (

                    <TouchableOpacity
                        key={item.title}
                        style={styles.item}
                        activeOpacity={0.7}
                    >

                        <View style={styles.iconBox}>

                            <Feather
                                name={item.icon}
                                size={24}
                                color="#1E9BD7"
                            />

                        </View>


                        <Text style={styles.text}>
                            {item.title}
                        </Text>

                    </TouchableOpacity>

                ))}

            </View>

        </View>

    );

};


export default DashboardQuickLinks;


const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fff",

        marginHorizontal: 16,
        marginTop: 16,

        borderRadius: 20,
        padding: 18,
    },


    heading: {
        fontSize: 17,
        fontWeight: "700",
        color: "#333",
        marginBottom: 18,
    },


    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },


    item: {
        alignItems: "center",
        flex: 1,
    },


    iconBox: {
        width: 52,
        height: 52,

        borderRadius: 16,

        backgroundColor: "#E8F6FD",

        justifyContent: "center",
        alignItems: "center",
    },


    text: {
        marginTop: 8,
        fontSize: 11,
        color: "#555",
        fontWeight: "600",
    },

});