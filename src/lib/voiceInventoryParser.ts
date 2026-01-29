export interface ParsedInventorySale {
    itemNameOrSku: string;
    quantitySold: number;
}

export const parseVoiceInventoryText = (text: string): ParsedInventorySale[] => {
    const sales: ParsedInventorySale[] = [];

    // Pattern: "sell [quantity] [optional: units/qty/of] [item name/sku]"
    // Also matches "sale" and handles optional "of"
    const saleRegex = /(?:sell|sale)\s+(\d+)\s+(?:units?|pieces?|items?|qty|quantity)?\s*(?:of\s+)?([^,.]+)/gi;

    let match;
    while ((match = saleRegex.exec(text)) !== null) {
        const quantity = parseInt(match[1]);
        const itemNameOrSku = match[2].trim();

        if (quantity > 0 && itemNameOrSku) {
            sales.push({
                itemNameOrSku,
                quantitySold: quantity
            });
        }
    }

    return sales;
};
