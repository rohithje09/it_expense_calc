export default {
    addItemToTable: async () => {
        console.log("🔵 addItemToTable function started!");

        // Ensure that the dropdown selections are valid
        const selectedProjectName = Dropdown_SelectedOption?.selectedOptionValue;
        const selectedItem = Dropdown_SelectionItem?.selectedOptionValue;

        if (!selectedProjectName) {
            showAlert("⚠️ Please select a project before submitting.", "warning");
            return;
        }

        if (!selectedItem) {
            showAlert("⚠️ Please select an item before submitting.", "warning");
            return;
        }

        let newItems = [];

        console.log("📌 Selected Project: ITEM");
        
        // Find the selected item details
        const itemDetails = getItems.data.find(item => item.id === selectedItem);

        if (!itemDetails) {
            showAlert("❌ Item details not found!", "error");
            return;
        }

        // Structure the new item, including `Remarks`
        newItems = [{
					  Category: selectedProjectName,
 Description: itemDetails.itemName || itemDetails.name || "❌ Not Found",
            Quantity_Nos: itemDetails.defaultQuantity || 1,  // Default to 1 if missing
           
       
            Cost_INR: itemDetails.price || 0,
            Remarks: itemDetails.remarks 
        }];

        // Append new items instead of replacing
        const updatedItems = [...(appsmith.store.selectedItems || []), ...newItems];

        // Store the updated list
        await storeValue("selectedItems", updatedItems);

        // Recalculate total cost
        const totalCost = updatedItems.reduce((sum, item) => sum + (item.Cost_INR || 0), 0);
        await storeValue("totalCost", totalCost);

        console.log("✅ Items Added:", updatedItems);
			console.log("🛠 Selected Items:", appsmith.store.selectedItems);

        

    }
};
