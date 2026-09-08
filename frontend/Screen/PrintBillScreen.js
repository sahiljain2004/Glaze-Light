import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import {
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import {
    Feather,
} from "@react-native-vector-icons/feather/static";
import RNPrint from "react-native-print";
import BillHeader from "../Components/BillHeader";
import BillCustomerInfo from "../Components/BillCustomerInfo";
import BillItems from "../Components/BillItems";
import BillSummary from "../Components/BillSummary";
import PrintButton from "../Components/PrintButton";


const PrintBillScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const saleData = route?.params?.saleData || {};


    // =====================================
    // CREATE HTML FOR ACTUAL PRINT - SIMPLE AND CLEAN
    // =====================================

    const createPrintHTML = () => {

        const items = saleData?.items || [];

        // ---------- helpers ----------
        const numberToWords = (num) => {
            const a = [
                "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
                "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
                "Seventeen", "Eighteen", "Nineteen"
            ];
            const b = [
                "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
            ];

            const inWords = (n) => {
                if (n < 20) return a[n];
                if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
                if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
                if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
                if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
                return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
            };

            const rupees = Math.floor(num);
            return rupees === 0 ? "Zero" : inWords(rupees);
        };

        // ---------- company / store details ----------
        const company = saleData?.company || {};
        const companyName = company.name || "Glaze Lights NX";
        const companyStatus = company.status || "(UNDER COMPOSITION)";
        const companyAddressLine = company.addressLine || "Near Food City";
        const companyAddressLine2 = company.addressLine2 || "Kailash Lodge, Patankar Bazar";
        const companyCity = company.city || "Gwalior, Madhya Pradesh";
        const companyPhone = company.phone || "9425115743";
        const companyEmail = company.email || "raja1695@yahoo.co.in";
        const companyGSTIN = company.gstin || "23AHDPA5640E1Z0";
        const logoInitial = (company.logoText || companyName).trim().charAt(0).toUpperCase();
        const logoLabel = company.logoLabel || companyName.split(" ").slice(0, 2).join(" ");

        // ---------- items ----------
        const itemRows = items.map((item, index) => {
            const quantity = Number(item.quantity || item.qty || 0);
            const unit = item.unit || item.unitName || "-";
            const price = Number(item.price || item.rate || 0);
            const total = Number(item.total || quantity * price || 0);

            return `
            <tr>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">${index + 1}</td>
                <td style="padding:10px; border-bottom:1px solid #eee;">${item.name || "Item"}</td>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">${quantity}</td>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">${unit}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">₹${price.toFixed(2)}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">₹${total.toFixed(2)}</td>
            </tr>
        `;
        }).join("");

        const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || item.qty || 0), 0);

        // ---------- amounts ----------
        const totalAmount = Number(saleData?.totalAmount || saleData?.amount || 0);
        const receivedAmount = Number(saleData?.receivedAmount || 0);
        const dueAmount = Number(saleData?.dueAmount ?? saleData?.balance ?? (totalAmount - receivedAmount));
        const invoiceNumber = saleData?.invoiceNumber || saleData?.transactionNumber || "INV-001";
        const date = saleData?.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
        const customerName = saleData?.customerName || saleData?.name || "Walk-in Customer";
        const phoneNumber = saleData?.phoneNumber || saleData?.customerPhone || "-";
        const address = saleData?.address || saleData?.customerAddress || "-";
        const paymentMethod = saleData?.paymentMethod || "Cash";
        const amountInWords = `Rupees ${numberToWords(totalAmount)} Only`;
        const description = saleData?.description
        const terms = saleData?.terms || [
            "6 Months Warranty on Fancy Lights",
            "1 Year Guarantee on outdoor Lights",
            "2 Year Guarantee on Hyglow Lights",
            "3 Year Guarantee on G Jaks Lights",
        ];

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    padding: 20px;
                    color: #1a1a1a;
                    background: #f4f5f7;
                }
                .bill-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 20px 24px;
                }
                .company-name {
                    font-size: 24px;
                    font-weight: 800;
                    color: #111;
                }
                .company-status {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 8px;
                }
                .company-address {
                    font-size: 13px;
                    color: #666;
                    line-height: 1.6;
                }
                .logo-box {
                    background: #3E3B6B;
                    color: #fff;
                    border-radius: 10px;
                    padding: 14px 22px;
                    text-align: center;
                    min-width: 110px;
                }
                .logo-box .logo-letter {
                    font-size: 26px;
                    font-weight: 800;
                    line-height: 1.1;
                }
                .logo-box .logo-label {
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 2px;
                }
                .invoice-title {
                    text-align: center;
                    font-size: 20px;
                    font-weight: 700;
                    color: #5D5A8B;
                    padding: 14px 0;
                    border-top: 1px solid #e5e5e5;
                    border-bottom: 1px solid #e5e5e5;
                }
                .info-section {
                    display: flex;
                    justify-content: space-between;
                    padding: 20px 24px;
                }
                .info-block .info-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 8px;
                }
                .info-block.right {
                    text-align: right;
                }
                .customer-name {
                    font-size: 17px;
                    font-weight: 700;
                    color: #111;
                }
                .invoice-detail-row {
                    font-size: 13px;
                    color: #444;
                    margin-bottom: 4px;
                }
                .customer-detail-row {
                    font-size: 13px;
                    color: #444;
                    margin-top: 4px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    padding: 0 24px;
                }
                thead th {
                    background: #5D5A8B;
                    color: #fff;
                    padding: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: left;
                }
                thead th:first-child { text-align: center; width: 40px; }
                thead th:nth-child(3),
                thead th:nth-child(4) { text-align: center; width: 70px; }
                thead th:nth-child(5),
                thead th:nth-child(6) { text-align: right; width: 100px; }
                .no-items {
                    text-align: center;
                    color: #999;
                    padding: 24px 10px;
                    font-size: 14px;
                }
                tfoot .total-row td {
                    border-top: 1px solid #333;
                    border-bottom: 1px solid #333;
                    font-size: 14px;
                    color: #111;
                }
                .footer-section {
                    display: flex;
                    justify-content: space-between;
                    gap: 24px;
                    padding: 20px 24px 24px;
                }
                .footer-left {
                    flex: 1;
                }
                .footer-left .footer-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 4px;
                }
                .footer-left .footer-value {
                    font-size: 13px;
                    color: #444;
                    margin-bottom: 16px;
                }
                .footer-left .terms-line {
                    font-size: 12px;
                    color: #666;
                    line-height: 1.6;
                }
                .footer-right {
                    flex: 1;
                    max-width: 300px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 12px;
                    font-size: 14px;
                }
                .summary-row .label { color: #666; }
                .summary-row .value { font-weight: 500; color: #222; }
                .summary-row.total {
                    background: #5D5A8B;
                    border-radius: 4px;
                    margin: 4px 0;
                }
                .summary-row.total .label,
                .summary-row.total .value {
                    color: #fff;
                    font-weight: 700;
                }
                .signature-box {
                    margin-top: 24px;
                    padding: 0 12px;
                    text-align: center;
                }
                .signature-for {
                    font-size: 13px;
                    color: #444;
                    font-weight: 600;
                    text-align: right;
                    margin-bottom: 6px;
                }
                .signature-space {
                    height: 50px;
                }
                .signature-line {
                    border-top: 1px solid #999;
                    margin: 0 0 6px;
                }
                .signature-label {
                    font-size: 12px;
                    color: #666;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="bill-container">
                <div class="header">
                    <div>
                        <div class="company-name">${companyName}</div>
                        <div class="company-status">${companyStatus}</div>
                        <div class="company-address">
                            ${companyAddressLine}<br>
                            ${companyAddressLine2}<br>
                            ${companyCity}<br>
                            Phone: ${companyPhone}<br>
                            Email: ${companyEmail}<br>
                            GSTIN: ${companyGSTIN}
                        </div>
                    </div>
                    <div class="logo-box">
                        <div class="logo-letter">${logoInitial}</div>
                        <div class="logo-label">${logoLabel}</div>
                    </div>
                </div>

                <div class="invoice-title">Tax Invoice</div>

                <div class="info-section">
                    <div class="info-block">
                        <div class="info-label">Bill To</div>
                        <div class="customer-name">${customerName}</div>
                        <div class="customer-detail-row">Phone: ${phoneNumber}</div>
                        <div class="customer-detail-row">Address: ${address}</div>
                    </div>
                    <div class="info-block right">
                        <div class="info-label">Invoice Details</div>
                        <div class="invoice-detail-row">Invoice No.: ${invoiceNumber}</div>
                        <div class="invoice-detail-row">Date: ${date}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows || `<tr><td colspan="6" class="no-items">No items added</td></tr>`}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="2" style="padding:10px; font-weight:700;">Total</td>
                            <td style="text-align:center; padding:10px; font-weight:700;">${totalQty}</td>
                            <td></td>
                            <td></td>
                            <td style="text-align:right; padding:10px; font-weight:700;">₹${totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="footer-section">
                    <div class="footer-left">
                        <div class="footer-label">Invoice Amount In Words</div>
                        <div class="footer-value">${amountInWords}</div>
 <div class="footer-label">Description</div>
                        <div class="footer-value">${description}</div>
                        <div class="footer-label">Terms And Conditions</div>
                        <div class="terms-line">
                            ${terms.map(t => `${t}<br>`).join("")}
                        </div>
                    </div>
                    <div class="footer-right">
                        <div class="summary-row">
                            <span class="label">Sub Total</span>
                            <span class="value">₹${totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="summary-row total">
                            <span class="label">Total</span>
                            <span class="value">₹${totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Received</span>
                            <span class="value">₹${receivedAmount.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Balance</span>
                            <span class="value">₹${dueAmount.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Payment Mode</span>
                            <span class="value">${paymentMethod}</span>
                        </div>

                        <div class="signature-box">
                            <div class="signature-for">For ${companyName}</div>
                            <div class="signature-space"></div>
                            <div class="signature-line"></div>
                            <div class="signature-label">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    };


    // =====================================
    // ACTUAL PRINT
    // =====================================

    const handlePrint = async () => {
        try {
            const html = createPrintHTML();
            await RNPrint.print({
                html: html,
                jobName: `Invoice-${saleData?.invoiceNumber || saleData?.transactionNumber || "001"}`,
            });
        } catch (error) {
            console.error("Print Error:", error);
            Alert.alert("Print Error", "Bill print nahi ho saka. Please try again.");
        }
    };


    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={27} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Print Preview</Text>
                <View style={styles.emptyView} />
            </View>

            {/* PREVIEW */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.bill}>
                    <BillHeader />
                    <BillCustomerInfo saleData={saleData} />
                    <BillItems items={saleData?.items || []} />
                    <BillSummary saleData={saleData} />
                </View>
            </ScrollView>

            {/* PRINT BUTTON */}
            <View style={styles.bottomContainer}>
                <PrintButton onPress={handlePrint} />
            </View>
        </View>
    );
};


export default PrintBillScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        height: 70,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },
    emptyView: {
        width: 27,
    },
    scrollContent: {
        padding: 18,
        paddingBottom: 100,
    },
    bill: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    bottomContainer: {
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
});