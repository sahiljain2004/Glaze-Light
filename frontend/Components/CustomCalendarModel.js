import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getMonthMatrix(year, month) {
    // month is 0-indexed (0 = January)
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let day = 1 - startWeekday;

    while (day <= daysInMonth) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(day);
            day++;
        }
        matrix.push(week);
    }
    return { matrix, daysInMonth };
}

export default function CustomCalendarModal({ visible, initialFrom, initialTo, onClose, onApply }) {
    const seedDate = initialFrom || new Date();
    const [viewYear, setViewYear] = useState(seedDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(seedDate.getMonth());
    const [rangeFrom, setRangeFrom] = useState(initialFrom || null);
    const [rangeTo, setRangeTo] = useState(initialTo || null);

    const { matrix, daysInMonth } = getMonthMatrix(viewYear, viewMonth);
    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const goPrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const handleDayPress = (day) => {
        if (day < 1 || day > daysInMonth) return;
        const picked = new Date(viewYear, viewMonth, day);

        if (!rangeFrom || (rangeFrom && rangeTo)) {
            // Start a fresh selection
            setRangeFrom(picked);
            setRangeTo(null);
        } else if (picked.getTime() < rangeFrom.getTime()) {
            // Picked an earlier date than the current "from" — restart from here
            setRangeFrom(picked);
            setRangeTo(null);
        } else {
            setRangeTo(picked);
        }
    };

    const dayState = (day) => {
        if (day < 1 || day > daysInMonth) return { inRange: false, isEdge: false };
        const current = new Date(viewYear, viewMonth, day);
        const t = current.getTime();
        const fromT = rangeFrom ? rangeFrom.getTime() : null;
        const toT = rangeTo ? rangeTo.getTime() : null;

        const inRange = fromT !== null && toT !== null && t >= fromT && t <= toT;
        const isEdge = t === fromT || t === toT;
        return { inRange, isEdge };
    };

    const handleApply = () => {
        if (!rangeFrom) return;
        onApply(rangeFrom, rangeTo || rangeFrom);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Date Range</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="x" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={goPrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="chevron-left" size={22} color="#374151" />
                        </TouchableOpacity>
                        <Text style={styles.monthLabel}>{monthLabel}</Text>
                        <TouchableOpacity onPress={goNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="chevron-right" size={22} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekRow}>
                        {WEEK_DAYS.map((d, i) => (
                            <Text key={i} style={styles.weekDayText}>
                                {d}
                            </Text>
                        ))}
                    </View>

                    {matrix.map((week, wi) => (
                        <View key={wi} style={styles.weekRow}>
                            {week.map((day, di) => {
                                const valid = day >= 1 && day <= daysInMonth;
                                const { inRange, isEdge } = dayState(day);
                                return (
                                    <TouchableOpacity
                                        key={di}
                                        style={[styles.dayCell, inRange && styles.dayCellInRange, isEdge && styles.dayCellEdge]}
                                        disabled={!valid}
                                        onPress={() => handleDayPress(day)}
                                    >
                                        <Text style={[styles.dayText, !valid && styles.dayTextMuted, isEdge && styles.dayTextEdge]}>
                                            {valid ? day : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.applyBtn, !rangeFrom && styles.applyBtnDisabled]}
                        onPress={handleApply}
                        disabled={!rangeFrom}
                    >
                        <Text style={styles.applyBtnText}>Apply</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const CELL_SIZE = 38;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    monthLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weekDayText: {
        width: CELL_SIZE,
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 6,
    },
    dayCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    dayCellInRange: {
        backgroundColor: '#EAF4FF',
    },
    dayCellEdge: {
        backgroundColor: '#2E7BF6',
        borderRadius: CELL_SIZE / 2,
    },
    dayText: {
        fontSize: 14,
        color: '#1F2937',
    },
    dayTextMuted: {
        color: 'transparent',
    },
    dayTextEdge: {
        color: '#fff',
        fontWeight: '700',
    },
    applyBtn: {
        marginTop: 16,
        backgroundColor: '#2E7BF6',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyBtnDisabled: {
        backgroundColor: '#B9D4F5',
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});