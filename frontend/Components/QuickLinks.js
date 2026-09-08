import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Feather } from "@react-native-vector-icons/feather/static";

const links = [
    {
        title: "60% OFF",
        icon: "zap",
        color: "#F7C531",
        bg: "#FFE6E8",
    },
    {
        title: "Add Txn",
        icon: "bookmark",
        color: "#444",
        bg: "#DFF3FF",
    },
    {
        title: "Sale Report",
        icon: "file-text",
        color: "#444",
        bg: "#DFF3FF",
    },
    {
        title: "Show All",
        icon: "arrow-right",
        color: "#444",
        bg: "#DFF3FF",
    },
];

const QuickLinks = () => {

    const navigation = useNavigation();

    const handlePress = (item) => {
        if (item.title === "Sale Report") {
            navigation.navigate("SaleReportScreen");
        }

    };

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>
                Quick Links
            </Text>

            <View style={styles.linksContainer}>

                {links.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        style={styles.linkItem}
                        onPress={() => handlePress(item)}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                {
                                    backgroundColor: item.bg,
                                },
                            ]}
                        >
                            <Feather
                                name={item.icon}
                                size={27}
                                color={item.color}
                            />
                        </View>

                        <Text style={styles.title}>
                            {item.title}
                        </Text>

                    </TouchableOpacity>
                ))}

            </View>

        </View>
    );
};

export default QuickLinks;

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 18,

        elevation: 3,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    heading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 20,
    },

    linksContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    linkItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    iconBox: {
        width: 58,
        height: 58,
        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        marginTop: 10,
        fontSize: 13,
        color: "#555",
        fontWeight: "600",
        textAlign: "center",
    },

});