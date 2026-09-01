import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";

const CustomTabs = ({ activeTab, setActiveTab }) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animation, {
            toValue: activeTab === "transaction" ? 0 : 1,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
        }).start();
    }, [activeTab]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.tab,
                    activeTab === "transaction" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("transaction")}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === "transaction" &&
                        styles.activeText,
                    ]}
                >
                    Transaction Details
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.tab,
                    activeTab === "party" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("party")}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === "party" && styles.activeText,
                    ]}
                >
                    Party Details
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomTabs;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 18,
        gap: 10,
    },

    tab: {
        flex: 1,
        height: 55,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    activeTab: {
        borderColor: "#E53945",
        backgroundColor: "#FFF7F7",
    },

    tabText: {
        fontSize: 15,
        color: "#777",
        fontWeight: "600",
    },

    activeText: {
        color: "#D92D3A",
    },
});