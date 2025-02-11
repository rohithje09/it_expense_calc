export default {
    generateCSV: () => {
        const items = Table1.tableData;
        if (!items || items.length === 0) {
            showAlert("No data available", "warning");
            return;
        }

        // Define the desired column order
        const headers = ["Category", "Description", "Quantity_Nos", "Cost_INR", "Remarks"];
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(","));

        // Add data rows in the specified order
        for (const row of items) {
            csvRows.push(headers.map(header => `"${row[header] || ""}"`).join(","));
        }

        // Convert to CSV format and store in Appsmith
        const csvContent = csvRows.join("\n");

        // Store CSV content in Appsmith store
        storeValue("csvData", csvContent);

        showAlert("CSV Generated. Click Download.", "success");
    }
};
