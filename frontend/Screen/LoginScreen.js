import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@react-native-vector-icons/feather/static";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginInput from "../Components/LoginInpur";
import api from '../services/api';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const isLoginEnabled = emailOrPhone.trim().length > 0 && password.trim().length > 0;

    const handleLogin = async () => {
        if (!isLoginEnabled) {
            return;
        }

        setLoading(true);

        const loginData = {
            identifier: emailOrPhone.trim(),
            password: password,
        };

        try {
            const { data } = await api.post('/api/auth/login', loginData);

            if (data.success) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));

                navigation.replace("TransactionScreen");
            } else {
                Alert.alert("Login Failed", data.message || "Invalid credentials");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
            const msg = error?.response?.data?.message || error?.message || 'Could not connect to server.';
            Alert.alert("Login Failed", msg);
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate("RegisterScreen");
    };

    const handleForgotPassword = () => {
        Alert.alert(
            "Forgot Password",
            "Please contact support to reset your password."
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.logoContainer}>
                    <Feather name="shopping-bag" size={34} color="#FFFFFF" />
                </View>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login to your account</Text>

                <View style={styles.formCard}>
                    <LoginInput
                        label="Email or Phone Number"
                        value={emailOrPhone}
                        onChangeText={setEmailOrPhone}
                        placeholder="Enter email or phone number"
                        icon="user"
                        keyboardType="email-address"
                    />

                    <LoginInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter password"
                        icon="lock"
                        secureTextEntry={!showPassword}
                        rightIcon={showPassword ? "eye-off" : "eye"}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />

                    <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            !isLoginEnabled && styles.loginButtonDisabled,
                            loading && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogin}
                        disabled={!isLoginEnabled || loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text
                                style={[
                                    styles.loginText,
                                    !isLoginEnabled && styles.loginTextDisabled,
                                ]}
                            >
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerNormal}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "#075CA8",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 18,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#222",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#777",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 28,
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        elevation: 3,
    },
    forgotButton: {
        alignSelf: "flex-end",
        marginTop: -3,
        marginBottom: 20,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#075CA8",
    },
    loginButton: {
        height: 55,
        backgroundColor: "#075CA8",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonDisabled: {
        backgroundColor: "#D5D9DE",
    },
    loginText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },
    loginTextDisabled: {
        color: "#888",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    registerNormal: {
        fontSize: 14,
        color: "#777",
    },
    registerText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#075CA8",
        marginLeft: 5,
    },
});
