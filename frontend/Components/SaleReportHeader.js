import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SaleReportHeader({ title = 'Sale Report', onBack, onShare, onPdf, onXls }) {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            <View style={styles.headerRight}>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#2E7BF6' }]} onPress={onShare}>
                    <Icon name="upload" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#E14D3F' }]} onPress={onPdf}>
                    <Text style={styles.iconBtnText}>Pdf</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#1E8E4E' }]} onPress={onXls}>
                    <Text style={styles.iconBtnText}>xls</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 34,
        height: 30,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    iconBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
});