import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Feather } from "@react-native-vector-icons/feather/static";

const Header = () => {
    return (
        <View style={styles.container}>

            <View style={styles.leftSection}>

                <TouchableOpacity activeOpacity={0.7}>
                    <Feather
                        name="arrow-left"
                        size={28}
                        color="#202020"
                    />
                </TouchableOpacity>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>GL</Text>
                </View>

                <View>
                    <Text style={styles.companyName}>
                        Glaze lights nx
                    </Text>

                    <Text style={styles.subtitle}>
                        Transaction Manager
                    </Text>
                </View>

            </View>

            <View style={styles.rightSection}>

                <TouchableOpacity style={styles.iconButton}>
                    <Feather
                        name="send"
                        size={21}
                        color="#F5A623"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Feather
                        name="bell"
                        size={25}
                        color="#333"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Feather
                        name="settings"
                        size={25}
                        color="#333"
                    />
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 20,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
        marginRight: 10,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },

    companyName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
    },

    subtitle: {
        fontSize: 11,
        color: "#999",
        marginTop: 2,
    },

    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconButton: {
        marginLeft: 12,
        padding: 4,
    },
});