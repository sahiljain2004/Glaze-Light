import React, { createContext, useContext, useState } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = (transaction) => {
        console.log("🔵 Adding to Context:", transaction);
        const newTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction,
        };
        console.log("➕ Adding:", newTransaction);
        setTransactions((prev) => [...prev, newTransaction]);
    };

    // Debug: Log transactions when they change
    React.useEffect(() => {
        console.log("📊 Total Transactions:", transactions.length);
    }, [transactions]);

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
            }}
        >
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