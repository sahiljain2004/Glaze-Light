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
import api from '../services/api';

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

            const [summaryRes, recentRes] = await Promise.all([
                api.get('/api/dashboard/summary'),
                api.get('/api/dashboard/recent?limit=5'),
            ]);

            const summaryData = summaryRes.data;
            const recentData = recentRes.data;

            if (summaryData.success) {
                setSummary(summaryData.summary);
            }

            if (recentData.success) {
                setRecentTransactions(recentData.recentTransactions || []);
            }
        } catch (error) {
            console.error('Error:', error);
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
