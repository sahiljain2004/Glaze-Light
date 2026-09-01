import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from "../Components/Header";
import SummaryCard from "../Components/SummaryCard";
import DashboardQuickLinks from "../Components/DashboardQuicklinks";
import RecentTransaction from "../Components/RecentTransaction";
import BottomNav from "../Components/BottomNav";

const Dashboard = () => {
    const navigation = useNavigation();
    const [summary, setSummary] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching dashboard data...');

            const token = await AsyncStorage.getItem('token');
            console.log('🔑 Token:', token ? '✅ Found' : '❌ Not found');

            if (!token) {
                Alert.alert('Error', 'Please login again');
                navigation.replace('LoginScreen');
                return;
            }

            // ✅ Test both APIs
            const baseUrl = 'http://10.151.11.36:5001';

            // 1. Summary API
            console.log('📡 Calling Summary API...');
            const summaryRes = await fetch(`${baseUrl}/api/dashboard/summary`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const summaryData = await summaryRes.json();
            console.log('📥 Summary Status:', summaryRes.status);
            console.log('📥 Summary Data:', summaryData);

            // 2. Recent API
            console.log('📡 Calling Recent API...');
            const recentRes = await fetch(`${baseUrl}/api/dashboard/recent?limit=5`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const recentData = await recentRes.json();
            console.log('📥 Recent Status:', recentRes.status);
            console.log('📥 Recent Data:', recentData);

            // ✅ Set data
            if (summaryData.success) {
                setSummary(summaryData.summary);
                console.log('✅ Summary set');
            } else {
                console.log('❌ Summary failed:', summaryData.message);
            }

            if (recentData.success) {
                setRecentTransactions(recentData.recentTransactions || []);
                console.log('✅ Recent set:', recentData.recentTransactions?.length);
            } else {
                console.log('❌ Recent failed:', recentData.message);
            }

            // ✅ Alert for debugging
            Alert.alert(
                'Dashboard Data',
                `Summary: ${summaryData.success ? '✅' : '❌'}\nRecent: ${recentData.success ? '✅' : '❌'}\nTransactions: ${recentData.recentTransactions?.length || 0}`
            );

        } catch (error) {
            console.error('❌ Error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#075CA8" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#075CA8']}
                        tintColor="#075CA8"
                    />
                }
            >
                <Header />
                <SummaryCard summary={summary} />
                <DashboardQuickLinks />
                <RecentTransaction transactions={recentTransactions} />
            </ScrollView>
            <BottomNav />
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
});