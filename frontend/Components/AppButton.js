import React from "react";
import Feather from "@react-native-vector-icons/feather/static";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from "react-native";


const AppButton = ({
    title,
    onPress,
    width,
    style,
    icon,
    top,
    backgroundColor,
    disabled = false,
}) => {

    return (

        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}

            style={[
                styles.button,

                { backgroundColor: backgroundColor, top: top },
                width !== undefined
                    ? { width: width }
                    : null,

                disabled
                    ? styles.disabledButton
                    : null,

                style,
            ]}
        >

            <View style={styles.content}>

                {/* ICON */}

                {icon && (
                    <Feather
                        name={icon}
                        size={22}
                        color="#FFFFFF"
                    />
                )}




                {/* BUTTON TEXT */}

                <Text style={styles.text}>
                    {title}
                </Text>

            </View>

        </TouchableOpacity>

    );

};


export default AppButton;



const styles = StyleSheet.create({

    button: {
        alignSelf: 'center',
        height: 55,
        position: "absolute",


        borderRadius: 12,

        justifyContent: "center",

        alignItems: "center",

        paddingHorizontal: 15,

    },


    content: {

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

    },


    iconContainer: {

        marginRight: 8,

    },


    text: {
        margin: 10,
        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "700",

    },


    disabledButton: {

        opacity: 0.5,

    },

});