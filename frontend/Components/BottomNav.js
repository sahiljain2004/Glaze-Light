import React from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    useNavigation,
    useNavigationState,
} from "@react-navigation/native";

import { Feather } from "@react-native-vector-icons/feather/static";


const BottomNav = () => {

    const navigation = useNavigation();

    const currentScreen = useNavigationState(
        (state) => state.routes[state.index]?.name
    );


    const menu = [
        {
            title: "HOME",
            icon: "home",
            screen: "TransactionScreen",
        },
        {
            title: "DASHBOARD",
            icon: "grid",
            screen: "Dashboard",
        },
        {
            title: "ITEMS",
            icon: "package",
            screen: "ItemsScreen",
        },
        {
            title: "MENU",
            icon: "menu",
            screen: "MenuScreen",
        },
    ];


    const handleNavigation = (screen) => {

        navigation.navigate(screen);

    };


    return (
        <View style={styles.container}>

            {menu.map((item) => {

                const isActive =
                    currentScreen === item.screen;

                return (
                    <TouchableOpacity
                        key={item.title}
                        style={styles.item}
                        activeOpacity={0.7}
                        onPress={() =>
                            handleNavigation(item.screen)
                        }
                    >

                        <Feather
                            name={item.icon}
                            size={27}
                            color={
                                isActive
                                    ? "#1E9BD7"
                                    : "#555"
                            }
                        />

                        <Text
                            style={[
                                styles.text,
                                isActive &&
                                styles.activeText,
                            ]}
                        >
                            {item.title}
                        </Text>

                    </TouchableOpacity>
                );

            })}

        </View>
    );
};


export default BottomNav;


const styles = StyleSheet.create({

    container: {
        height: 72,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderColor: "#EEEEEE",
    },

    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        marginTop: 4,
        fontSize: 10,
        color: "#777",
        fontWeight: "600",
    },

    activeText: {
        color: "#1E9BD7",
        fontWeight: "700",
    },

});