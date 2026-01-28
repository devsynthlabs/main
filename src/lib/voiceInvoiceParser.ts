export interface ParsedInvoiceData {
    invoiceNumber?: string;
    customerName?: string;
    items: {
        product: string;
        quantity: number;
        rate: number;
    }[];
}

export const parseVoiceInvoiceText = (text: string): ParsedInvoiceData => {
    const data: ParsedInvoiceData = { items: [] };
    const lowerText = text.toLowerCase();

    // 1. Extract Invoice Number
    // Examples: "invoice number INV-123", "invoice # 456", "invoice 789"
    const invMatch = text.match(/(?:invoice|bill)(?:\s+number|\s+#)?\s+([A-Z0-9-]+)/i);
    if (invMatch) data.invoiceNumber = invMatch[1];

    // 2. Extract Customer Name
    // Examples: "customer name John Doe", "bill to Jane Smith", "client Acme Corp"
    const customerMatch = text.match(/(?:customer|client|bill to|name)(?:\s+name)?\s+(?:is\s+)?([^,.]+?)(?=\s+(?:add|item|date|invoice|$))/i);
    if (customerMatch) data.customerName = customerMatch[1].trim();

    // 3. Extract Items
    // Examples: "add item Pillow quantity 2 rate 250", "item Chair price 1000 qty 5"
    // Look for items starting with "item" or "add item"
    const itemSegments = text.split(/(?=item|add\s+item)/i);

    itemSegments.forEach(segment => {
        if (!segment.toLowerCase().includes('item')) return;

        // Extract product name (text between "item" and "quantity/rate/price")
        const productMatch = segment.match(/(?:item|add\s+item)\s+([^,.]+?)(?=\s+(?:quantity|qty|rate|price|amount|$))/i);
        if (productMatch) {
            const product = productMatch[1].trim();

            // Extract quantity
            const qtyMatch = segment.match(/(?:quantity|qty)\s+(\d+)/i);
            const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;

            // Extract rate/price
            const rateMatch = segment.match(/(?:rate|price|amount|cost)\s+(\d+(?:\.\d+)?)/i);
            const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;

            if (product && rate > 0) {
                data.items.push({ product, quantity, rate });
            }
        }
    });

    return data;
};
