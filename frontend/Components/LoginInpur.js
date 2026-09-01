import React from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const LoginInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    secureTextEntry = false,
    rightIcon,
    onRightIconPress,
    keyboardType = "default",
}) => {

    return (

        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <View style={styles.inputBox}>

                <Feather
                    name={icon}
                    size={21}
                    color="#777"
                />

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />

                {rightIcon && (

                    <Text
                        onPress={onRightIconPress}
                        style={styles.rightIcon}
                    >
                        <Feather
                            name={rightIcon}
                            size={21}
                            color="#777"
                        />
                    </Text>

                )}

            </View>

        </View>

    );

};


export default LoginInput;


const styles = StyleSheet.create({

    container: {

        marginBottom: 16,

    },

    label: {

        fontSize: 15,

        fontWeight: "700",

        color: "#333",

        marginBottom: 8,

    },

    inputBox: {

        height: 55,

        borderWidth: 1,

        borderColor: "#D9DDE2",

        borderRadius: 10,

        backgroundColor: "#FFFFFF",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 14,

    },

    input: {

        flex: 1,

        height: "100%",

        fontSize: 15,

        color: "#222",

        marginLeft: 10,

    },

    rightIcon: {

        padding: 5,

    },

});