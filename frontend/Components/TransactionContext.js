import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = useCallback((transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction,
        };
        setTransactions((prev) => [...prev, newTransaction]);
    }, []);

    const value = useMemo(() => ({ transactions, addTransaction }), [transactions, addTransaction]);

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionProvider");
    }
    return context;
};