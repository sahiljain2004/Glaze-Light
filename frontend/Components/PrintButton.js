import React from "react";

import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import {
    Feather,
} from "@react-native-vector-icons/feather/static";


const PrintButton = ({
    onPress,
}) => {

    return (

        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >

            <Feather
                name="printer"
                size={21}
                color="#FFFFFF"
            />

            <Text style={styles.text}>
                Print Bill
            </Text>

        </TouchableOpacity>

    );

};


export default PrintButton;


const styles =
    StyleSheet.create({

        button: {

            height: 54,

            backgroundColor:
                "#075CA8",

            borderRadius:
                12,

            flexDirection:
                "row",

            justifyContent:
                "center",

            alignItems:
                "center",

        },


        text: {

            color:
                "#FFFFFF",

            fontSize:
                17,

            fontWeight:
                "700",

            marginLeft:
                10,

        },

    });