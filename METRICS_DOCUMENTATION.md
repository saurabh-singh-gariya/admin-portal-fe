# Bet Metrics Documentation

## Overview
This document explains the metrics displayed in the Bet History page and how they are calculated.

## Metrics Displayed

### 1. **Total Bets**
- **Label**: "Total Bets"
- **Type**: Count
- **Calculation**: 
  ```
  Total Bets = Count of all bets matching the applied filters
  ```
- **Description**: The total number of bets that match the current filter criteria (date range, status, difficulty, etc.)

---

### 2. **Total Volume**
- **Label**: "Total Volume"
- **Type**: Currency Amount (INR)
- **Calculation**:
  ```
  Total Volume = Sum of all betAmount values for filtered bets
  ```
- **Formula**:
  ```javascript
  totalBetAmount = filteredBets.reduce((sum, bet) => sum + parseFloat(bet.betAmount), 0)
  ```
- **Description**: The sum of all bet amounts placed, regardless of whether they won or lost. This represents the total money wagered.

---

### 3. **Total Wins**
- **Label**: "Total Wins"
- **Type**: Currency Amount (INR)
- **Calculation**:
  ```
  Total Wins = Sum of all winAmount values for bets that have a winAmount
  ```
- **Formula**:
  ```javascript
  totalWinAmount = filteredBets
    .filter(bet => bet.winAmount)  // Only bets that won
    .reduce((sum, bet) => sum + parseFloat(bet.winAmount || '0'), 0)
  ```
- **Description**: The total amount paid out to players as winnings. Only includes bets that have a `winAmount` (i.e., bets that won).

---

### 4. **Net Revenue**
- **Label**: "Net Revenue"
- **Type**: Currency Amount (INR)
- **Calculation**:
  ```
  Net Revenue = Total Volume - Total Wins
  ```
- **Formula**:
  ```javascript
  netRevenue = totalBetAmount - totalWinAmount
  ```
- **Description**: The profit made by the platform. This is the difference between what players bet and what they won back. A positive value means the platform made money.

---

## Calculation Flow

### Current Implementation (Frontend with Dummy Data)

```javascript
// 1. Filter bets based on applied filters (date, status, difficulty, etc.)
let filtered = [...allBets];
// Apply filters...

// 2. Calculate metrics from ALL filtered bets (not just current page)
const totalBets = filtered.length;

const totalBetAmount = filtered.reduce((sum, b) => 
  sum + parseFloat(b.betAmount), 0
).toFixed(2);

const totalWinAmount = filtered
  .filter(b => b.winAmount)  // Only winning bets
  .reduce((sum, b) => sum + parseFloat(b.winAmount || '0'), 0)
  .toFixed(2);

const netRevenue = (parseFloat(totalBetAmount) - parseFloat(totalWinAmount)).toFixed(2);
```

### Future Implementation (Backend API)

When the API is integrated, the backend should:
1. Apply all filters (date range, status, difficulty, currency, etc.)
2. Calculate these metrics on the server side
3. Return the summary along with the bet list

**Expected API Response Structure:**
```json
{
  "status": "0000",
  "data": {
    "bets": [...],
    "pagination": {...},
    "summary": {
      "totalBets": 150,
      "totalBetAmount": "50000.00",
      "totalWinAmount": "45000.00",
      "netRevenue": "5000.00"
    }
  }
}
```

---

## Important Notes

### 1. **Filter-Based Calculations**
- All metrics are calculated based on the **currently applied filters**
- If you filter by date range, status, or difficulty, the metrics reflect only those filtered bets
- This ensures the summary cards always match what's shown in the table

### 2. **Pagination Independence**
- Metrics are calculated from **ALL filtered bets**, not just the current page
- The table shows paginated results (e.g., 20 bets per page)
- But the summary cards show totals for all matching bets across all pages

### 3. **Win Amount Handling**
- Only bets with a `winAmount` value are included in "Total Wins"
- Pending or lost bets (where `winAmount` is null/undefined) are excluded
- This ensures accurate win calculations

### 4. **Net Revenue Interpretation**
- **Positive Net Revenue**: Platform profit (more bets than payouts)
- **Negative Net Revenue**: Platform loss (more payouts than bets) - rare but possible
- **Zero Net Revenue**: Break-even

---

## Example Calculation

Let's say we have 3 bets with the following data:

| Bet ID | Bet Amount | Win Amount | Status |
|--------|------------|------------|--------|
| 1      | ₹100       | ₹150       | WON    |
| 2      | ₹200       | -          | LOST   |
| 3      | ₹50        | ₹75        | WON    |

**Calculations:**
- **Total Bets**: 3
- **Total Volume**: ₹100 + ₹200 + ₹50 = ₹350
- **Total Wins**: ₹150 + ₹75 = ₹225 (only winning bets)
- **Net Revenue**: ₹350 - ₹225 = ₹125

---

## Currency

All monetary values are displayed in **INR (Indian Rupees)** with proper formatting:
- Format: `₹X,XXX.XX`
- Locale: `en-IN`
- Example: `₹50,000.00`

---

## Future Enhancements

Potential additional metrics that could be added:
- **Average Bet Amount**: Total Volume / Total Bets
- **Win Rate**: (Number of Winning Bets / Total Bets) × 100
- **Average Win Amount**: Total Wins / Number of Winning Bets
- **Profit Margin**: (Net Revenue / Total Volume) × 100
- **By Difficulty Breakdown**: Separate metrics for EASY, MEDIUM, HARD, DAREDEVIL
- **By Status Breakdown**: Separate metrics for WON, LOST, PENDING

