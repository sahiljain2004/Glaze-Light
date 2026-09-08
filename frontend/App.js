import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    NavigationContainer,
} from "@react-navigation/native";
import { TransactionProvider } from "./Components/TransactionContext";
import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { View, ActivityIndicator } from 'react-native';
import { navigationRef } from './services/navigationRef';

// Import Screens
import SaleScreen from "./Screen/SaleScreen";
import TransactionScreen from "./Screen/TransactionScreen";
import Dashboard from "./Screen/Dashboard";
import ItemsScreen from "./Screen/ItemsScreen";

import AddItemScreen from "./Screen/AddItemScreen";
import PrintBillScreen from "./Screen/PrintBillScreen";
import LoginScreen from "./Screen/LoginScreen";
import SaleReportScreen from "./Screen/SaleReportScreen";

const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ==========================================
    // CHECK LOGIN STATUS ON APP START
    // ==========================================

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const user = await AsyncStorage.getItem('user');

                if (user) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                await AsyncStorage.removeItem('user');
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#075CA8" />
            </View>
        );
    }

    // ==========================================
    // NAVIGATION
    // ==========================================

    return (
        <TransactionProvider>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: "none",
                    }}
                >
                    {isLoggedIn ? (
                        // ✅ USER LOGGED IN - Direct Screens
                        <>
                            <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
                            <Stack.Screen name="Dashboard" component={Dashboard} />
                            <Stack.Screen name="ItemsScreen" component={ItemsScreen} />
                            <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
                            <Stack.Screen name="SaleScreen" component={SaleScreen} />
                            <Stack.Screen name="PrintBillScreen" component={PrintBillScreen} />
                            <Stack.Screen name="SaleReportScreen" component={SaleReportScreen} />
                        </>
                    ) : (
                        // ❌ USER NOT LOGGED IN - Show Login
                        <>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} />
                            <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
                            <Stack.Screen name="Dashboard" component={Dashboard} />
                            <Stack.Screen name="ItemsScreen" component={ItemsScreen} />
                            <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
                            <Stack.Screen name="SaleScreen" component={SaleScreen} />
                        
                            <Stack.Screen name="PrintBillScreen" component={PrintBillScreen} />
                            <Stack.Screen name="SaleReportScreen" component={SaleReportScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </TransactionProvider>
    );
};

export default App;