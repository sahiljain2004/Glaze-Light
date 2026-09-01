// Pure JS date helpers — no external dependency, so nothing to link/break.

export function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function endOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

export function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
// ✅ Parse "29-Aug-26" to Date object
export const parseDateString = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;

    // Month mapping
    const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    // Check if it's "29-Aug-26" format
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parts[1];
            const year = parseInt(parts[2]);
            const fullYear = 2000 + year;
            return new Date(fullYear, monthMap[month] || 0, day);
        }
    }

    try {
        return new Date(dateStr);
    } catch {
        return new Date();
    }
};
export function getPeriodRange(period, referenceDate = new Date()) {
    const now = new Date(referenceDate);
    const today = startOfDay(now);

    switch (period) {
        case 'Today':
            return { from: today, to: endOfDay(today) };

        case 'Yesterday': {
            const y = new Date(today);
            y.setDate(y.getDate() - 1);
            return { from: y, to: endOfDay(y) };
        }

        case 'This Week': {
            const dayOfWeek = today.getDay(); // 0 = Sunday
            const from = new Date(today);
            from.setDate(today.getDate() - dayOfWeek);
            return { from, to: endOfDay(now) };
        }

        case 'Last Week': {
            const dayOfWeek = today.getDay();
            const thisWeekStart = new Date(today);
            thisWeekStart.setDate(today.getDate() - dayOfWeek);
            const lastWeekStart = new Date(thisWeekStart);
            lastWeekStart.setDate(thisWeekStart.getDate() - 7);
            const lastWeekEnd = new Date(thisWeekStart);
            lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
            return { from: lastWeekStart, to: endOfDay(lastWeekEnd) };
        }

        case 'This Month': {
            const from = new Date(now.getFullYear(), now.getMonth(), 1);
            return { from, to: endOfDay(now) };
        }

        case 'Last Month': {
            const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const to = new Date(now.getFullYear(), now.getMonth(), 0);
            return { from, to: endOfDay(to) };
        }

        case 'This Quarter': {
            const quarter = Math.floor(now.getMonth() / 3);
            const from = new Date(now.getFullYear(), quarter * 3, 1);
            return { from, to: endOfDay(now) };
        }

        case 'This Year': {
            const from = new Date(now.getFullYear(), 0, 1);
            return { from, to: endOfDay(now) };
        }

        case 'Last Year': {
            const from = new Date(now.getFullYear() - 1, 0, 1);
            const to = new Date(now.getFullYear() - 1, 11, 31);
            return { from, to: endOfDay(to) };
        }

        default:
            // Fallback: treat unknown period as "This Month"
            return getPeriodRange('This Month', referenceDate);
    }
}

// dd/mm/yyyy — matches the format used in the reference design
export function formatDate(date) {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// Checks whether `date` falls within [from, to], inclusive
export function isWithinRange(date, from, to) {
    const t = date.getTime();
    return t >= from.getTime() && t <= to.getTime();
}