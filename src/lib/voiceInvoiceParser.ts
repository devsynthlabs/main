export interface ParsedInvoiceData {
    invoiceNumber?: string;
    customerName?: string;
    invoiceDate?: string;
    items: {
        product: string;
        quantity: number;
        rate: number;
    }[];
}

export const parseInvoiceText = (text: string): ParsedInvoiceData => {
    const data: ParsedInvoiceData = { items: [] };
    const lines = text.split('\n');

    // 1. Extract Invoice Number
    const invMatch = text.match(/(?:invoice|bill|receipt|inv)(?:\s+number|\s+#)?[:\s]+([A-Z0-9-/]+)/i);
    if (invMatch) data.invoiceNumber = invMatch[1];

    // 2. Extract Date
    const dateMatch = text.match(/(?:date|dated)[:\s]+(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i);
    if (dateMatch) data.invoiceDate = dateMatch[1];

    // 3. Extract Customer Name
    const customerMatch = text.match(/(?:customer|client|bill to|ship to|name)[:\s]+([^,\n@]+)(?=\n|$)/i);
    if (customerMatch) {
        const name = customerMatch[1].trim();
        if (name && !name.toLowerCase().includes('invoice') && !name.toLowerCase().includes('date')) {
            data.customerName = name;
        }
    }

    // 4. Extract Items (Table format or "ItemName Qty Rate Total")
    // This is a heuristic approach for OCR tables
    lines.forEach(line => {
        // Look for lines that contain a number (quantity/price) and some text (product)
        // Pattern: [Text] [Qty] [Rate/Price] [Total]
        const rowMatch = line.match(/^(.+?)\s+(\d+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
        if (rowMatch) {
            const product = rowMatch[1].trim();
            const quantity = parseInt(rowMatch[2]);
            const rate = parseFloat(rowMatch[3]);
            if (product && !product.toLowerCase().includes('total') && !product.toLowerCase().includes('subtotal') && quantity > 0) {
                data.items.push({ product, quantity, rate });
            }
        }
    });

    // Fallback: If no items found by row matching, try the voice-style "item" keyword
    if (data.items.length === 0) {
        const itemSegments = text.split(/(?=item|add\s+item)/i);
        itemSegments.forEach(segment => {
            if (!segment.toLowerCase().includes('item')) return;
            const productMatch = segment.match(/(?:item|add\s+item)\s+([^,.]+?)(?=\s+(?:quantity|qty|rate|price|amount|$))/i);
            if (productMatch) {
                const product = productMatch[1].trim();
                const qtyMatch = segment.match(/(?:quantity|qty)\s+(\d+)/i);
                const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
                const rateMatch = segment.match(/(?:rate|price|amount|cost)\s+(\d+(?:\.\d+)?)/i);
                const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;
                if (product && rate > 0) data.items.push({ product, quantity, rate });
            }
        });
    }

    return data;
};

// Keep old export for compatibility if needed, but alias to new one
export const parseVoiceInvoiceText = parseInvoiceText;
